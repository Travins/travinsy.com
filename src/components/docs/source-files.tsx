import "server-only"

import { readFile } from "node:fs/promises"
import { cache } from "react"
import { CodeBlock } from "./code-block"
import { getRegistryItem } from "./registry-items"
import { installedPath, toInstalledImports } from "./installed-imports"

// 同次服务端渲染共享已解析节点，让查看器与源码列表在 RSC 中引用同一份高亮。
export const getSourceFiles = cache(async (name: string) => {
  const item = getRegistryItem(name)
  return Promise.all(
    item.files.map(async (file) => {
      const path = installedPath(file)
      const source = toInstalledImports(await readFile(file.path, "utf8"))
      const extension = path.split(".").at(-1)!
      return {
        path,
        source,
        lines: source.replace(/\n$/, "").split("\n").length,
        code: await CodeBlock({
          code: source,
          lang:
            (
              { ts: "ts", tsx: "tsx", css: "css", json: "json" } as Record<
                string,
                string
              >
            )[extension] ?? "tsx",
          bare: true,
          collapse: false,
        }),
      }
    }),
  )
})
