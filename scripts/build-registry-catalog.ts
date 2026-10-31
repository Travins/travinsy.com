import { readFile, readdir, writeFile } from "node:fs/promises"

type RegistryFile = Record<string, unknown> & { content?: unknown }
type RegistryItem = Record<string, unknown> & {
  name: string
  files?: RegistryFile[]
}
type Registry = Record<string, unknown> & { items: RegistryItem[] }

async function main() {
  const registry = JSON.parse(
    await readFile("registry.json", "utf8"),
  ) as Registry
  const targets = new Map<string, string>()
  for (const item of registry.items)
    for (const file of item.files ?? [])
      if (typeof file.path === "string" && typeof file.target === "string")
        targets.set(
          file.path.replace(/^src\//, "@/").replace(/\.tsx?$/, ""),
          file.target
            .replace(/^@ui\//, "components/ui/")
            .replace(/^@components\//, "components/")
            .replace(/\.tsx?$/, ""),
        )
  // 仅改写发布产物，站点继续直接使用 registry 源码。
  for (const name of await readdir("public/r")) {
    if (!name.endsWith(".json")) continue
    const filename = `public/r/${name}`
    const data = JSON.parse(await readFile(filename, "utf8"))
    function rewrite(item: RegistryItem) {
      for (const file of item.files ?? []) {
        if (typeof file.content !== "string") continue
        file.content = file.content.replace(
          /@\/registry\/[^"'`\s)]+/g,
          (spec) => {
            for (const [source, target] of [
              ["ui", "components/ui"],
              ["lib", "lib"],
              ["hooks", "hooks"],
            ])
              if (spec.startsWith(`@/registry/${source}/`))
                return spec.replace(`@/registry/${source}/`, `@/${target}/`)
            const target = targets.get(spec)
            if (!target || !/^(components|lib|hooks)\//.test(target))
              throw Error(`${filename}: ${file.path}: 无法推导导入 ${spec}`)
            return `@/${target}`
          },
        )
        if ((file.content as string).includes("@/registry/"))
          throw Error(`${filename}: ${file.path}: 发布内容仍含 registry 导入`)
      }
      for (const child of (item.items ?? []) as RegistryItem[]) rewrite(child)
    }
    rewrite(data)
    await writeFile(filename, JSON.stringify(data, null, 2) + "\n")
  }
  // 目录保留文件元数据；源码只放在各自的安装 JSON 中。
  registry.items = await Promise.all(
    registry.items.map(async ({ name }) => {
      const item = JSON.parse(
        await readFile(`public/r/${name}.json`, "utf8"),
      ) as RegistryItem

      return {
        ...item,
        ...(item.files
          ? {
              files: item.files.map((file) => {
                const metadata = { ...file }
                delete metadata.content
                return metadata
              }),
            }
          : {}),
      }
    }),
  )
  await writeFile(
    "public/r/registry.json",
    JSON.stringify(registry, null, 2) + "\n",
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
