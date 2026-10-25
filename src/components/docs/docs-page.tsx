import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import type { Node } from "fumadocs-core/page-tree"
import { findNeighbour } from "fumadocs-core/page-tree"
import { source, sectionPages, sections, type DocsSection } from "@/lib/source"
import { siteConfig } from "@/config/site"
import { GridSection } from "@/registry/ui/grid-layout/grid-layout"
import { mdxComponents } from "./mdx-components"

export type DocsRouteProps = { params: Promise<{ slug?: string[] }> }
function getPage(section: DocsSection, slug: string[] = []) {
  const page = source.getPage([section, ...slug], siteConfig.defaultLanguage)
  if (!page) notFound()
  return page
}
export async function docsMetadata(
  section: DocsSection,
  { params }: DocsRouteProps,
): Promise<Metadata> {
  const page = getPage(section, (await params).slug)
  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: `${siteConfig.url}${page.url}` },
  }
}
export function docsParams(section: DocsSection) {
  return sectionPages(section).map((page) => ({ slug: page.slugs.slice(1) }))
}
function TreeLinks({ nodes, current }: { nodes: Node[]; current: string }) {
  return (
    <ul className="flex flex-col gap-1">
      {nodes.map((node, index) => {
        if (node.type === "separator")
          return (
            <li key={index} className="mt-6 mb-2 text-xs text-muted-foreground">
              {node.name}
            </li>
          )
        if (node.type === "folder")
          return (
            <li key={node.$id ?? index} className="mt-5">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                {node.name}
              </p>
              {node.index && (
                <Link
                  className="docs-nav-link"
                  href={node.index.url}
                  aria-current={current === node.index.url ? "page" : undefined}
                >
                  概览
                </Link>
              )}
              <TreeLinks
                nodes={node.children.filter((child) => child !== node.index)}
                current={current}
              />
            </li>
          )
        return (
          <li key={node.url}>
            <Link
              className="docs-nav-link"
              href={node.url}
              aria-current={current === node.url ? "page" : undefined}
            >
              {node.name}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
export async function DocsPage({
  section,
  params,
}: DocsRouteProps & { section: DocsSection }) {
  const { slug = [] } = await params
  const page = getPage(section, slug)
  const tree = source.getPageTree(siteConfig.defaultLanguage)
  const Body = page.data.body
  const neighbours = findNeighbour(tree, page.url)
  const isIndex = slug.length === 0 && section === "components"
  return (
    <GridSection className="docs-layout">
      <aside className="docs-sidebar">
        <nav aria-label="文档导航">
          <p className="font-mono text-xs text-muted-foreground">
            DOCUMENTATION
          </p>
          <TreeLinks nodes={tree.children} current={page.url} />
        </nav>
      </aside>
      <main id="main-content" className="docs-main">
        <nav className="mb-8 text-xs text-muted-foreground" aria-label="面包屑">
          <Link href={`/${section}/`}>{sections[section].title}</Link>
          {slug.length > 0 && <span> / {page.data.title}</span>}
        </nav>
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {page.data.title}
          </h1>
          <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
            {page.data.description}
          </p>
          {page.data.links && (
            <div className="mt-4 flex flex-wrap gap-4">
              {Object.entries(page.data.links).map(([label, href]) => (
                <a
                  key={label}
                  className="text-sm underline underline-offset-4"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {label} ↗
                </a>
              ))}
            </div>
          )}
        </header>
        {isIndex ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {sectionPages(section)
              .filter((item) => item.slugs.length > 1)
              .map((item) => (
                <Link
                  key={item.url}
                  href={item.url}
                  className="group border border-edge p-6 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <p className="mb-6 font-mono text-xs text-muted-foreground">
                    {item.slugs[1] === "installation"
                      ? "GETTING STARTED"
                      : "REGISTRY / UI"}
                  </p>
                  <h2 className="text-lg font-medium">
                    {item.data.title}{" "}
                    <span
                      aria-hidden
                      className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                    >
                      ↗
                    </span>
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {item.data.description}
                  </p>
                </Link>
              ))}
          </div>
        ) : (
          <article className="docs-prose">
            <Body components={mdxComponents} />
          </article>
        )}
        <nav
          aria-label="相邻文档"
          className="mt-14 grid grid-cols-2 gap-4 border-t border-edge pt-6"
        >
          {neighbours.previous ? (
            <Link href={neighbours.previous.url} className="text-sm">
              <span className="mb-2 block text-xs text-muted-foreground">
                ← 上一页
              </span>
              {neighbours.previous.name}
            </Link>
          ) : (
            <span />
          )}
          {neighbours.next && (
            <Link href={neighbours.next.url} className="text-right text-sm">
              <span className="mb-2 block text-xs text-muted-foreground">
                下一页 →
              </span>
              {neighbours.next.name}
            </Link>
          )}
        </nav>
      </main>
      <aside className="docs-toc">
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
      </aside>
    </GridSection>
  )
}
