import { readFile, writeFile } from "node:fs/promises"

async function main() {
  const registry = JSON.parse(await readFile("registry.json", "utf8"))
  // 目录也包含构建后的源码，使 URL 可直接用于 registry 浏览和安装。
  registry.items = await Promise.all(
    registry.items.map(async (item: { name: string }) =>
      JSON.parse(await readFile(`public/r/${item.name}.json`, "utf8")),
    ),
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
