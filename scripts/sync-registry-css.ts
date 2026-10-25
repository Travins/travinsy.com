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
  const expected = [
    "screen-line-top",
    "screen-line-bottom",
    "bg-hatch",
    "bg-ruler",
    "bg-dots",
    "bg-grid-fine",
    "bg-plus",
    "bg-wave",
  ]
  const missing = expected.filter((name) => !css[`@utility ${name}`])
  if (missing.length || Object.keys(css).length !== expected.length)
    throw new Error(`grid.css 的工具类与预期不一致（缺少：${missing.join("、") || "无"}），请审查同步脚本`)
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
