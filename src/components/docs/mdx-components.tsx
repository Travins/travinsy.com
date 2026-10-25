import type { MDXComponents } from "mdx/types"
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
