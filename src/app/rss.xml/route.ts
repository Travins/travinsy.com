import { siteConfig } from "@/config/site"
import { blogPosts } from "@/lib/source"
import { absoluteUrl, escapeXml } from "@/lib/site-content"

export const dynamic = "force-static"

export function GET() {
  const posts = blogPosts()
  const items = posts
    .map((post) => {
      const url = escapeXml(absoluteUrl(post.url))
      return `<item><title>${escapeXml(post.data.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${escapeXml(post.data.description)}</description><pubDate>${new Date(`${post.data.date}T00:00:00+08:00`).toUTCString()}</pubDate>${(post.data.tags ?? []).map((tag) => `<category>${escapeXml(tag)}</category>`).join("")}</item>`
    })
    .join("\n")
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>${escapeXml(siteConfig.name)} · 博客</title><link>${absoluteUrl("/blog/")}</link><description>${escapeXml(siteConfig.description)}</description><language>zh-CN</language><atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml" />
${items}
</channel></rss>`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } },
  )
}
