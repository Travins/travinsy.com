import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { siteConfig } from "@/config/site"
import { PostEntry } from "@/components/blog/post-entry"
import { formatBlogDate, readingMinutes } from "@/lib/blog"
import { pageMetadata } from "@/lib/metadata"
import { blogPosts } from "@/lib/source"
import {
  GridContainer,
  GridSection,
  GridSeparator,
} from "@/registry/ui/grid-layout/grid-layout"

const baseMetadata = pageMetadata({
  title: "博客",
  description: "关于组件、设计与个人网站的实践记录。",
  path: "/blog/",
  ogKey: "blog",
})
export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    ...baseMetadata.alternates,
    types: { "application/rss+xml": `${siteConfig.url}/rss.xml` },
  },
}

// 与首页章节同一套结构：宽屏左侧 9rem 编号栏（竖线隔开），右侧内容；窄屏编号栏并入内容上方
const rowGrid = "md:grid md:grid-cols-[9rem_minmax(0,1fr)]"

export default async function BlogPage() {
  const posts = blogPosts()
  const minutes = await Promise.all(posts.map((post) => readingMinutes(post.data)))
  return (
    <GridContainer id="main-content">
      <GridSection className={rowGrid}>
        <div className="hidden border-r border-edge px-5 py-5 md:block">
          <div
            aria-hidden="true"
            className="flex flex-col gap-1 font-mono md:sticky md:top-[calc(var(--header-height)+1rem)]"
          >
            <span className="text-3xl font-light text-primary tabular-nums">
              {String(posts.length).padStart(2, "0")}
            </span>
            <span className="text-[10px] tracking-[0.2em] text-muted-foreground">
              NOTES
            </span>
          </div>
        </div>
        <div className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
          <p className="mb-4 font-mono text-xs text-muted-foreground md:hidden">
            笔记 / {String(posts.length).padStart(2, "0")}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            边做，边记录。
          </h1>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm leading-7 text-muted-foreground">
              关于组件、设计与个人网站的实践记录。
            </p>
            <a
              href="/rss.xml"
              className="font-mono text-xs text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              订阅 RSS <ArrowUpRight aria-hidden="true" className="inline size-3" />
            </a>
          </div>
        </div>
      </GridSection>
      <GridSeparator />
      {posts.map((post, i) => (
        <GridSection key={post.url}>
          <article>
            <Link
              href={post.url}
              className={`group block min-w-0 transition-colors hover:bg-muted/30 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring ${rowGrid}`}
            >
              <div className="flex items-center gap-x-4 px-4 pt-6 font-mono text-xs text-muted-foreground sm:px-6 md:block md:space-y-2 md:border-r md:border-edge md:px-5 md:py-8">
                <span aria-hidden="true" className="hidden text-primary md:block">
                  {String(posts.length - i).padStart(2, "0")}
                </span>
                <time dateTime={post.data.date} className="block">
                  {formatBlogDate(post.data.date)}
                </time>
                <span className="block">约 {minutes[i]} 分钟</span>
              </div>
              <div className="relative px-4 pt-3 pb-8 sm:px-6 md:px-6 md:py-8 lg:px-10">
                <PostEntry
                  as="h2"
                  large
                  title={post.data.title}
                  description={post.data.description}
                  tags={post.data.tags}
                />
                <ArrowUpRight
                  aria-hidden="true"
                  className="absolute top-8 right-4 hidden size-4 text-muted-foreground transition-transform group-hover:text-primary sm:right-6 md:block motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5 lg:right-10"
                />
              </div>
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
