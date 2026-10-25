import { readFile } from "node:fs/promises"
import { CodeBlock } from "./code-block"
import { BlockViewerClient } from "./block-viewer-client"
import { InstallCommand } from "./install-command"
import { getRegistryItem } from "./registry-items"
import { toInstalledImports } from "./installed-imports"

const langs: Record<string, string> = {
  ts: "ts",
  tsx: "tsx",
  css: "css",
  json: "json",
}

/**
 * 区块 / 页面模板查看器：iframe 预览（可切换设备宽度）+ 多文件代码 + 安装命令。
 * 文件内容在构建时从 registry.json 登记的源码读取，与发布的 JSON 同源。
 */
export async function BlockViewer({ name }: { name: string }) {
  const item = getRegistryItem(name)
  const files = await Promise.all(
    item.files.map(async (file) => {
      const shown = file.target ?? file.path.split("/").at(-1)!
      const code = toInstalledImports(await readFile(file.path, "utf8"))
      return {
        path: shown,
        source: code,
        code: (
          <CodeBlock
            code={code}
            lang={langs[shown.split(".").at(-1)!] ?? "tsx"}
            bare
            collapse={false}
          />
        ),
      }
    }),
  )
  return (
    <BlockViewerClient
      name={name}
      title={item.title}
      height={item.meta?.iframeHeight ?? "720px"}
      files={files}
      install={<InstallCommand name={name} bare />}
    />
  )
}
