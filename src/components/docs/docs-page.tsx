import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { source, sectionPages, type DocsSection } from "@/lib/source"
import { siteConfig } from "@/config/site"
import { DocsCard, DocsShell } from "./docs-shell"
import { createMdxComponents } from "./mdx-components"
import { pageMarkdown } from "./page-markdown"

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
export async function DocsPage({
  section,
  params,
}: DocsRouteProps & { section: DocsSection }) {
  const { slug = [] } = await params
  const page = getPage(section, slug)
  const Body = page.data.body
  // 组件分区的 index 是卡片目录；入门分区的 index 是正文页（介绍）
  const overview = slug.length === 0 && section === "components"
  return (
    <DocsShell
      section={section}
      url={page.url}
      title={page.data.title}
      description={page.data.description}
      overview={overview}
      markdown={overview ? undefined : await pageMarkdown(page)}
      links={page.data.links}
      toc={page.data.toc}
    >
      {overview ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {sectionPages(section)
            .filter((item) => item.slugs.length > 1)
            .map((item) => (
              <DocsCard
                key={item.url}
                href={item.url}
                eyebrow="REGISTRY / UI"
                title={item.data.title}
                description={item.data.description}
              />
            ))}
        </div>
      ) : (
        <article className="docs-prose">
          <Body components={createMdxComponents(section === "components" ? slug.at(-1) : undefined)} />
        </article>
      )}
    </DocsShell>
  )
}
