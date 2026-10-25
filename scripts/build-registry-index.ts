import { readdir, writeFile } from "node:fs/promises"

// 区块与页面模板的入口演示：src/registry/<blocks|templates>/<name>/demo.tsx。
// demo 不会被安装到用户项目（不写进 registry.json 的 files），只用于 /view/<name>/ 预览。
const viewRoots = ["blocks", "templates"] as const

async function main() {
  const names = (await readdir("src/registry/examples"))
    .filter((file) => file.endsWith(".tsx"))
    .sort()
  for (const file of names) {
    if (!/^[a-z0-9-]+\.tsx$/.test(file))
      throw new Error(`演示文件名必须为 kebab-case：${file}`)
  }
  const views: { name: string; path: string }[] = []
  for (const root of viewRoots) {
    const dirs = await readdir(`src/registry/${root}`, { withFileTypes: true })
    for (const dir of dirs.filter((entry) => entry.isDirectory())) {
      const files = await readdir(`src/registry/${root}/${dir.name}`)
      if (!files.includes("demo.tsx"))
        throw new Error(`${root}/${dir.name} 缺少预览入口 demo.tsx`)
      views.push({ name: dir.name, path: `./${root}/${dir.name}/demo` })
    }
  }
  views.sort((a, b) => a.name.localeCompare(b.name))
  await writeFile(
    "src/registry/__index__.tsx",
    `// 此文件由 scripts/build-registry-index.ts 生成，请勿手改。
"use client"
import { lazy, type ComponentType, type LazyExoticComponent } from "react"

export const registryExamples: Record<string, LazyExoticComponent<ComponentType>> = {
${names.map((file) => `  "${file.slice(0, -4)}": lazy(() => import("./examples/${file.slice(0, -4)}")),`).join("\n")}
}

// 区块 / 页面模板的整页预览，键为 registry 条目名
export const registryViews: Record<string, LazyExoticComponent<ComponentType>> = {
${views.map((view) => `  "${view.name}": lazy(() => import("${view.path}")),`).join("\n")}
}
`,
  )
  console.log(`已生成 ${names.length} 个演示索引、${views.length} 个整页预览索引`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
