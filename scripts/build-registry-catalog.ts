import { readFile, writeFile } from "node:fs/promises"

type RegistryFile = Record<string, unknown> & { content?: unknown }
type RegistryItem = Record<string, unknown> & {
  name: string
  files?: RegistryFile[]
}
type Registry = Record<string, unknown> & { items: RegistryItem[] }

async function main() {
  const registry = JSON.parse(await readFile("registry.json", "utf8")) as Registry
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
