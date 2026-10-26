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
  // fumadocs-mdx 会把 Markdown 图片转成静态导入（带宽高的对象），这里取出真实地址与尺寸
  img: ({ src, width, height, alt, ...props }) => {
    const image: { src?: string; width?: number; height?: number } =
      typeof src === "object" && src !== null
        ? (src as { src: string; width?: number; height?: number })
        : { src: src as string | undefined }
    return (
      // eslint-disable-next-line @next/next/no-img-element -- 静态导出不使用图片优化
      <img
        src={image.src}
        width={width ?? image.width}
        height={height ?? image.height}
        alt={alt ?? ""}
        loading="lazy"
        decoding="async"
        className="h-auto max-w-full rounded-md border border-border"
        {...props}
      />
    )
  },
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
