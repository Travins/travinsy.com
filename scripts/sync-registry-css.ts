import { readFile, writeFile } from "node:fs/promises"
import postcss from "postcss"

async function main() {
  const registry = JSON.parse(await readFile("registry.json", "utf8"))
  const root = postcss.parse(await readFile("src/styles/grid.css", "utf8"))
  function object(node: postcss.Container): Record<string, unknown> {
    const result: Record<string, unknown> = {}
    node.each((child) => {
      if (child.type === "decl") result[child.prop] = child.value
      else if (child.type === "rule") result[child.selector] = object(child)
      else if (child.type === "atrule")
        result[`@${child.name} ${child.params}`.trim()] = child.nodes
          ? object(child)
          : {}
    })
    return result
  }
  const css: Record<string, unknown> = {}
  root.walkAtRules("utility", (rule) => {
    css[`@utility ${rule.params}`] = object(rule)
  })
  if (Object.keys(css).length !== 3)
    throw new Error("grid.css 应包含三个网格工具类，请审查同步脚本")
  const grid = registry.items.find(
    (item: { name: string }) => item.name === "grid-layout",
  )
  grid.css = { ...css, "@layer base": { html: { "overflow-x": "clip" } } }
  await writeFile("registry.json", JSON.stringify(registry, null, 2) + "\n")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
