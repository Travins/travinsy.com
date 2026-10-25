import { ComponentSource } from "./component-source"
import { InstallCommandClient } from "./install-command-client"
import { getRegistryItem } from "./registry-items"

/**
 * 安装区：命令（CLI，可切换 URL / 命名空间）与手动（依赖 + 源码）两种方式。
 * bare 时只输出命令框（不带外层标题、不带手动安装），放进别的框里使用。
 */
export function InstallCommand({
  name,
  bare = false,
}: {
  name: string
  bare?: boolean
}) {
  const item = getRegistryItem(name)
  return (
    <InstallCommandClient
      name={name}
      bare={bare}
      dependencies={item.dependencies ?? []}
    >
      {bare ? null : <ComponentSource name={name} />}
    </InstallCommandClient>
  )
}
