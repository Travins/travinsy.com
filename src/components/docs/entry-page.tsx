import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import type { MDXComponents } from "mdx/types"
import { source } from "@/lib/source"
import { siteConfig } from "@/config/site"
import { GridSection } from "@/registry/ui/grid-layout/grid-layout"
import { BlockViewer } from "./block-viewer"
import { mdxComponents } from "./mdx-components"
import {
  entrySections,
  sectionItems,
  type EntrySection,
} from "./registry-items"

// 区块 / 模板文档：在通用 MDX 组件之外多一个 BlockViewer
const entryMdxComponents: MDXComponents = { ...mdxComponents, BlockViewer }

export type EntryRouteProps = { params: Promise<{ slug?: string[] }> }

const sectionIntro: Record<EntrySection, string> = {
  blocks:
    "可直接放进页面的整块界面。在 iframe 里独立预览，切换设备宽度，查看多文件源码，一条命令安装。",
  templates:
    "整页风格模板：一条命令得到完整页面，只需修改一个配置文件，就能换成自己的内容。",
}

function getPage(section: EntrySection, slug: string[] = []) {
  const page = source.getPage([section, ...slug], siteConfig.defaultLanguage)
  if (!page) notFound()
  return page
}

export function entryParams(section: EntrySection) {
  return [
    { slug: [] as string[] },
    ...sectionItems(section).map((item) => ({ slug: [item.name] })),
  ]
}

export async function entryMetadata(
  section: EntrySection,
  { params }: EntryRouteProps,
): Promise<Metadata> {
  const page = getPage(section, (await params).slug)
  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: `${siteConfig.url}${page.url}` },
  }
}

function SideNav({ current }: { current: string }) {
  return (
    <nav aria-label="文档导航">
      <p className="font-mono text-xs text-muted-foreground">DOCUMENTATION</p>
      <ul className="mt-4 flex flex-col gap-1">
        <li>
          <Link className="docs-nav-link" href="/components/">
            ← 组件
          </Link>
        </li>
        {(Object.keys(entrySections) as EntrySection[]).map((key) => (
          <li key={key} className="mt-5">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              {entrySections[key].title}
            </p>
            <ul className="flex flex-col gap-1">
              <li>
                <Link
                  className="docs-nav-link"
                  href={`/${key}/`}
                  aria-current={current === `/${key}/` ? "page" : undefined}
                >
                  概览
                </Link>
              </li>
              {sectionItems(key).map((item) => (
                <li key={item.name}>
                  <Link
                    className="docs-nav-link"
                    href={`/${key}/${item.name}/`}
                    aria-current={
                      current === `/${key}/${item.name}/` ? "page" : undefined
                    }
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export async function EntryPage({
  section,
  params,
}: EntryRouteProps & { section: EntrySection }) {
  const { slug = [] } = await params
  const page = getPage(section, slug)
  const items = sectionItems(section)
  const index = items.findIndex((item) => item.name === slug[0])
  const previous = index > 0 ? items[index - 1] : undefined
  const next = index >= 0 ? items[index + 1] : undefined
  const isIndex = slug.length === 0
  const Body = page.data.body
  return (
    <GridSection className="docs-layout">
      <aside className="docs-sidebar">
        <SideNav current={page.url} />
      </aside>
      <main id="main-content" className="docs-main">
        <nav className="mb-8 text-xs text-muted-foreground" aria-label="面包屑">
          <Link href={`/${section}/`}>{entrySections[section].title}</Link>
          {!isIndex && <span> / {page.data.title}</span>}
        </nav>
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {page.data.title}
          </h1>
          <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
            {isIndex ? sectionIntro[section] : page.data.description}
          </p>
        </header>
        {isIndex ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <Link
                key={item.name}
                href={`/${section}/${item.name}/`}
                className="group border border-edge p-6 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
              >
                <p className="mb-6 font-mono text-xs text-muted-foreground">
                  {entrySections[section].label} / {item.files.length} FILES
                </p>
                <h2 className="text-lg font-medium">
                  {item.title}{" "}
                  <span
                    aria-hidden
                    className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                  >
                    ↗
                  </span>
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <article className="docs-prose">
            <Body components={entryMdxComponents} />
          </article>
        )}
        {!isIndex && (
          <nav
            aria-label="相邻文档"
            className="mt-14 grid grid-cols-2 gap-4 border-t border-edge pt-6"
          >
            {previous ? (
              <Link href={`/${section}/${previous.name}/`} className="text-sm">
                <span className="mb-2 block text-xs text-muted-foreground">
                  ← 上一页
                </span>
                {previous.title}
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={`/${section}/${next.name}/`}
                className="text-right text-sm"
              >
                <span className="mb-2 block text-xs text-muted-foreground">
                  下一页 →
                </span>
                {next.title}
              </Link>
            )}
          </nav>
        )}
      </main>
      <aside className="docs-toc">
        {!isIndex && (
          <nav aria-label="本页目录">
            <p className="mb-4 text-xs font-medium">本页目录</p>
            <ul className="flex flex-col gap-3">
              {page.data.toc.map((item) => (
                <li
                  key={item.url}
                  style={{
                    paddingInlineStart: `${Math.max(0, item.depth - 2) * 12}px`,
                  }}
                >
                  <a
                    className="text-xs text-muted-foreground hover:text-foreground"
                    href={item.url}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </aside>
    </GridSection>
  )
}
