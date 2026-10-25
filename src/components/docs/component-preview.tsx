import { readFile } from "node:fs/promises"
import { CodeBlock } from "./code-block"
import { ComponentPreviewClient } from "./component-preview-client"
import { hasRegistryItem } from "./registry-items"
import { toInstalledImports } from "./installed-imports"

/**
 * 组件文档里的示例：预览 / 代码两个标签。
 * item 是示例所属的 registry 条目（用于「在 v0 中打开」），在组件文档里默认取页面 slug。
 */
export async function ComponentPreview({
  name,
  item,
}: {
  name: string
  item?: string
}) {
  if (!/^[a-z0-9-]+$/.test(name)) throw new Error("无效的演示名称")
  const source = toInstalledImports(
    await readFile(`src/registry/examples/${name}.tsx`, "utf8"),
  )
  return (
    <ComponentPreviewClient
      name={name}
      item={item && hasRegistryItem(item) ? item : undefined}
      source={source}
      code={<CodeBlock code={source} bare />}
    />
  )
}
