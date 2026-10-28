import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { notFound } from "next/navigation"
import { pageMetadata } from "@/lib/metadata"
import { PostAside, PostTocMobile } from "@/components/blog/post-aside"
import { PostMeta } from "@/components/blog/post-meta"
import { ReadingProgress } from "@/components/blog/reading-progress"
import { DocsToc } from "@/components/docs/docs-toc"
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
  const base = pageMetadata({
    title: post.data.title,
    description: post.data.description,
    path: post.url,
    ogKey: `blog/${post.slugs[0]}`,
    type: "article",
  })
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
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
  const minutes = await readingMinutes(post.data)
  const toc = post.data.toc
  return (
    <GridContainer
      id="main-content"
      className="post-scope [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-ring"
    >
      <ReadingProgress targetId="post-body" />
      <GridSection className="post-layout">
        <PostAside
          date={post.data.date}
          minutes={minutes}
          tags={post.data.tags}
        />
        <article className="post-main">
          <div className="post-column">
            {/* 返回列表：所有宽度都放在标题上方，用按钮的形态，和文档页的「← 组件」一致 */}
            <Link
              href="/blog/"
              className={buttonVariants({
                variant: "secondary",
                className: "-ml-0.5",
              })}
            >
              <ArrowLeft aria-hidden="true" data-icon="inline-start" />
              全部文章
            </Link>
            <h1 className="mt-6 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
              {post.data.title}
            </h1>
            <p className="mt-5 leading-7 text-muted-foreground">
              {post.data.description}
            </p>
            {/* 左栏在 ≥1280px 才出现，更窄时元信息与目录放回正文头部 */}
            <div className="mt-6 xl:hidden">
              <PostMeta
                date={post.data.date}
                tags={post.data.tags}
                minutes={minutes}
              />
            </div>
            <div className="mt-10 xl:hidden">
              <PostTocMobile items={toc} />
            </div>
            <div
              id="post-body"
              className="post-body docs-prose mt-10 min-w-0 border-t border-dashed border-edge pt-8 xl:mt-12"
            >
              <Body components={mdxComponents} />
            </div>
          </div>
        </article>
        <aside className="docs-toc">
          <DocsToc items={toc} title="本文目录" />
        </aside>
      </GridSection>
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
