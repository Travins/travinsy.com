import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { siteConfig } from "@/config/site"
import { PostMeta } from "@/components/blog/post-meta"
import { mdxComponents } from "@/components/docs/mdx-components"
import { readingMinutes } from "@/lib/blog"
import { blogPosts, blogSource } from "@/lib/source"
import {
  GridColumns,
  GridContainer,
  GridSection,
  GridSeparator,
} from "@/registry/ui/grid-layout/grid-layout"

type Props = { params: Promise<{ slug: string }> }
export const dynamicParams = false
export function generateStaticParams() {
  return blogPosts().map((post) => ({ slug: post.slugs[0] }))
}
function getPost(slug: string) {
  const post = blogSource.getPage([slug])
  if (!post) notFound()
  return { ...post, url: `${post.url.replace(/\/$/, "")}/` }
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug)
  const url = `${siteConfig.url}${post.url}`
  return {
    title: post.data.title,
    description: post.data.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.data.title,
      description: post.data.description,
      url,
      siteName: siteConfig.name,
      locale: "zh_CN",
      publishedTime: `${post.data.date}T00:00:00+08:00`,
      tags: post.data.tags,
    },
  }
}
export default async function BlogPost({ params }: Props) {
  const post = getPost((await params).slug)
  const posts = blogPosts()
  const index = posts.findIndex((item) => item.url === post.url)
  const previous = posts[index + 1]
  const next = posts[index - 1]
  const Body = post.data.body
  return (
    <GridContainer
      id="main-content"
      className="[&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-ring"
    >
      <article>
        <GridSection className="px-4 py-10 sm:px-6 sm:py-14">
          {/* 容器加宽到 64rem 后，标题与正文仍限制在约 42rem 内，保证可读 */}
          <div className="mx-auto w-full max-w-2xl">
            <Link
              href="/blog/"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ← 全部文章
            </Link>
            <h1 className="mt-8 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
              {post.data.title}
            </h1>
            <p className="mt-5 leading-7 text-muted-foreground">
              {post.data.description}
            </p>
            <div className="mt-6">
              <PostMeta
                date={post.data.date}
                tags={post.data.tags}
                minutes={await readingMinutes(post.data)}
              />
            </div>
          </div>
        </GridSection>
        <GridSection className="min-w-0 px-4 pt-4 pb-12 sm:px-6">
          <div className="docs-prose mx-auto max-w-2xl min-w-0">
            <Body components={mdxComponents} />
          </div>
        </GridSection>
      </article>
      <GridSeparator />
      <GridSection>
        <nav aria-label="相邻文章">
          <GridColumns>
            {[
              { neighbour: previous, label: "← 上一篇" },
              { neighbour: next, label: "下一篇 →" },
            ].map(({ neighbour, label }, i) => {
              return neighbour ? (
                <Link
                  key={i}
                  href={neighbour.url}
                  className="min-w-0 px-4 py-6 hover:bg-muted/30 sm:px-6"
                >
                  <span className="mb-3 block font-mono text-xs text-muted-foreground">
                    {label}
                  </span>
                  <span className="text-sm leading-7">
                    {neighbour.data.title}
                  </span>
                </Link>
              ) : (
                <p
                  key={i}
                  className="px-4 py-6 text-xs text-muted-foreground sm:px-6"
                >
                  {i === 0 ? "已经是最早的文章" : "已经是最新的文章"}
                </p>
              )
            })}
          </GridColumns>
        </nav>
      </GridSection>
    </GridContainer>
  )
}
