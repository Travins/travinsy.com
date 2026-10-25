import type { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/config/site"
import { PostMeta } from "@/components/blog/post-meta"
import { blogPosts } from "@/lib/source"
import {
  GridContainer,
  GridSection,
  GridSeparator,
} from "@/registry/ui/grid-layout/grid-layout"

export const metadata: Metadata = {
  title: "博客",
  description: "关于组件、设计与个人网站的实践记录。",
  alternates: {
    canonical: `${siteConfig.url}/blog/`,
    types: { "application/rss+xml": `${siteConfig.url}/rss.xml` },
  },
}

export default function BlogPage() {
  const posts = blogPosts()
  return (
    <GridContainer id="main-content">
      <GridSection className="px-4 py-10 sm:px-6 sm:py-14">
        <p className="mb-4 font-mono text-xs text-muted-foreground">
          笔记 / {String(posts.length).padStart(2, "0")}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          边做，边记录。
        </h1>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm leading-7 text-muted-foreground">
            关于组件、设计与个人网站的实践记录。
          </p>
          <a
            href="/rss.xml"
            className="text-xs text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            订阅 RSS ↗
          </a>
        </div>
      </GridSection>
      <GridSeparator />
      {posts.map((post) => (
        <GridSection key={post.url}>
          <article>
            <Link
              href={post.url}
              className="group block min-w-0 px-4 py-8 transition-colors hover:bg-muted/30 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring sm:px-6"
            >
              <PostMeta date={post.data.date} tags={post.data.tags} />
              <h2 className="mt-4 text-xl font-medium tracking-tight text-balance group-hover:text-primary sm:text-2xl">
                {post.data.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-pretty text-muted-foreground">
                {post.data.description}
              </p>
              <span className="mt-6 block text-xs text-muted-foreground">
                阅读全文 <span aria-hidden>↗</span>
              </span>
            </Link>
          </article>
        </GridSection>
      ))}
      {posts.length === 0 && (
        <GridSection className="px-4 py-12 text-muted-foreground sm:px-6">
          文章正在整理中。
        </GridSection>
      )}
    </GridContainer>
  )
}
