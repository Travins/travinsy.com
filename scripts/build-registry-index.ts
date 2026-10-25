import { readdir, writeFile } from "node:fs/promises"

async function main() {
  const names = (await readdir("src/registry/examples"))
    .filter((file) => file.endsWith(".tsx"))
    .sort()
  for (const file of names) {
    if (!/^[a-z0-9-]+\.tsx$/.test(file))
      throw new Error(`演示文件名必须为 kebab-case：${file}`)
  }
  await writeFile(
    "src/registry/__index__.tsx",
    `// 此文件由 scripts/build-registry-index.ts 生成，请勿手改。
"use client"
import { lazy, type ComponentType, type LazyExoticComponent } from "react"

export const registryExamples: Record<string, LazyExoticComponent<ComponentType>> = {
${names.map((file) => `  "${file.slice(0, -4)}": lazy(() => import("./examples/${file.slice(0, -4)}")),`).join("\n")}
}
`,
  )
  console.log(`已生成 ${names.length} 个演示索引`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
