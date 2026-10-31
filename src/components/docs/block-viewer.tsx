import { getSourceFiles } from "./source-files"
import { BlockViewerClient } from "./block-viewer-client"
import { InstallCommand } from "./install-command"
import { getRegistryItem } from "./registry-items"

/**
 * 区块 / 页面查看器：iframe 预览（可切换设备宽度）+ 多文件代码 + 安装命令。
 * 文件内容在构建时从 registry.json 登记的源码读取，与发布的 JSON 同源。
 */
export async function BlockViewer({ name }: { name: string }) {
  const item = getRegistryItem(name)
  const files = await getSourceFiles(name)
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
