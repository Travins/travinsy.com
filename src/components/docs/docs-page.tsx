import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { source, sectionPages, type DocsSection } from "@/lib/source"
import { siteConfig } from "@/config/site"
import { pageMetadata } from "@/lib/metadata"
import { DocsShell } from "./docs-shell"
import { createMdxComponents } from "./mdx-components"
import { pageMarkdown } from "./page-markdown"
import { hasRegistryItem } from "./registry-items"

import { ComponentGallery } from "@/components/sections/component-gallery"
import { AgentsLanding } from "@/components/sections/agents-landing"

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
  return pageMetadata({
    title: page.data.title,
    description: page.data.description,
    path: page.url,
    ogKey: page.slugs.join("/"),
  })
}
export function docsParams(section: DocsSection) {
  return sectionPages(section).map((page) => ({ slug: page.slugs.slice(1) }))
}
/** 组件页的 slug 末段即 registry 条目名 */
function registryNameFor(slug: string[]) {
  const name = slug.at(-1)
  return name && hasRegistryItem(name) ? name : undefined
}
export async function DocsPage({
  section,
  params,
}: DocsRouteProps & { section: DocsSection }) {
  const { slug = [] } = await params
  const page = getPage(section, slug)
  const Body = page.data.body
  if (slug.length === 0 && section === "components") return <ComponentGallery />
  if (slug.length === 0 && section === "agents") return <AgentsLanding />
  return (
    <DocsShell
      section={section}
      url={page.url}
      title={page.data.title}
      titleEn={page.data.titleEn}
      description={page.data.description}
      markdown={await pageMarkdown(page)}
      sourcePath={page.path}
      registryName={registryNameFor(slug)}
      links={page.data.links}
      toc={page.data.toc}
    >
      <article className="docs-prose">
        <Body
          components={createMdxComponents(
            section === "components" ? slug.at(-1) : undefined,
          )}
        />
      </article>
    </DocsShell>
  )
}
