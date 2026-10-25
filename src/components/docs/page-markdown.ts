import { articleText } from "@/lib/blog"

/** 「复制页面」用的 Markdown：标题 + 简介 + MDX 原文（已去掉 frontmatter）。 */
export async function pageMarkdown(page: {
  data: {
    title: string
    description?: string
    getText: (type: "raw") => Promise<string>
  }
}) {
  const body = await articleText(page.data)
  return [`# ${page.data.title}`, page.data.description, body]
    .filter(Boolean)
    .join("\n\n")
}
