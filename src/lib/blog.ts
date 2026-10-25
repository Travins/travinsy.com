import { cache } from "react"

// getText("raw") 返回原始 MDX；仅去除文件开头的 YAML frontmatter。
export const articleText = cache(
  async (data: { getText: (type: "raw") => Promise<string> }) =>
    (await data.getText("raw"))
      .replace(/^\uFEFF?---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "")
      .trim(),
)

export async function readingMinutes(data: Parameters<typeof articleText>[0]) {
  const text = (await articleText(data))
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]*>/g, " ")
  const chinese = text.match(/\p{Script=Han}/gu)?.length ?? 0
  const words =
    text.replace(/\p{Script=Han}/gu, " ").match(/[\p{L}\p{N}]+/gu)?.length ?? 0
  return Math.max(1, Math.ceil(chinese / 400 + words / 200))
}

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`))
}
