import { siteConfig } from "@/config/site"
import { articleText } from "@/lib/blog"
import { blogPosts } from "@/lib/source"
import { absoluteUrl, docsPages } from "@/lib/site-content"

export const dynamic = "force-static"

export async function GET() {
  const pages = [...docsPages(), ...blogPosts()]
  const sections = await Promise.all(
    pages.map(
      async (page) =>
        `# ${page.data.title}\n\n来源：${absoluteUrl(page.url)}\n\n${await articleText(page.data)}`,
    ),
  )
  return new Response(
    `# ${siteConfig.name} · 文档与博客全文\n\n${sections.join("\n\n---\n\n")}\n`,
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    },
  )
}
