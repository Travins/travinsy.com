import type { MDXComponents } from "mdx/types"
import type { ComponentProps } from "react"
import { ComponentPreview } from "./component-preview"
import { ComponentSource } from "./component-source"
import { InstallCommand } from "./install-command"
import { PropsTable } from "./props-table"
import { MdxPre } from "./code-block"

export const mdxComponents: MDXComponents = {
  ComponentPreview,
  ComponentSource,
  InstallCommand,
  PropsTable,
  pre: MdxPre,
  h2: ({ children, id, ...props }) => (
    <h2 id={id} {...props}>
      <a href={`#${id}`}>{children}</a>
    </h2>
  ),
  h3: ({ children, id, ...props }) => (
    <h3 id={id} {...props}>
      <a href={`#${id}`}>{children}</a>
    </h3>
  ),
}

/** 组件文档：示例默认归属页面 slug 对应的 registry 条目（用于「在 v0 中打开」）。 */
export function createMdxComponents(item?: string): MDXComponents {
  return {
    ...mdxComponents,
    ComponentPreview: (props: ComponentProps<typeof ComponentPreview>) => (
      <ComponentPreview item={item} {...props} />
    ),
  }
}
