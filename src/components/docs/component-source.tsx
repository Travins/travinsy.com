import { readFile } from "node:fs/promises"
import registry from "../../../registry.json"
import { CodeBlock } from "./code-block"
import { installedPath, toInstalledImports } from "./installed-imports"

export async function ComponentSource({ name }: { name: string }) {
  const item = registry.items.find((item) => item.name === name)
  if (!item) throw new Error(`未登记的 Registry 条目：${name}`)
  return (
    <>
      {await Promise.all(
        item.files.map(async (file) => (
          <CodeBlock
            key={file.path}
            code={toInstalledImports(await readFile(file.path, "utf8"))}
            title={installedPath(file)}
          />
        )),
      )}
    </>
  )
}
