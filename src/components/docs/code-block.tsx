import { codeToHtml } from "shiki"
import { codeTheme } from "./highlight-theme"
import { cache, type ComponentProps, type ReactNode } from "react"
import { CopyButton } from "./copy-button"

// 高亮语义映射到主题 token，主题色与亮暗模式均自动继承。
const highlight = cache((code: string, lang: string) =>
  codeToHtml(code, { lang, theme: codeTheme }),
)
export async function CodeBlock({
  code,
  lang = "tsx",
  title,
}: {
  code: string
  lang?: string
  title?: string
}) {
  const html = await highlight(code, lang)
  return (
    <figure className="docs-code not-prose">
      <figcaption>
        <span>{title ?? lang}</span>
        <CopyButton value={code} />
      </figcaption>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  )
}
function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textOf).join("")
  if (node && typeof node === "object" && "props" in node)
    return textOf((node.props as { children?: ReactNode }).children)
  return ""
}
export function MdxPre({
  children,
  ...props
}: ComponentProps<"pre"> & { title?: string; "data-language"?: string }) {
  return (
    <figure className="docs-code not-prose">
      <figcaption>
        <span>{props.title ?? props["data-language"] ?? "代码"}</span>
        <CopyButton value={textOf(children)} />
      </figcaption>
      <pre {...props}>{children}</pre>
    </figure>
  )
}
