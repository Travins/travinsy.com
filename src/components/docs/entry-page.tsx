import { notFound } from "next/navigation"
import type { Metadata } from "next"
import type { MDXComponents } from "mdx/types"
import { source } from "@/lib/source"
import { siteConfig } from "@/config/site"
import { pageMetadata } from "@/lib/metadata"
import { DocsShell } from "./docs-shell"
import { BlockViewer } from "./block-viewer"
import { mdxComponents } from "./mdx-components"
import { pageMarkdown } from "./page-markdown"
import { sectionItems, type EntrySection } from "./registry-items"

// 区块 / 页面文档：在通用 MDX 组件之外多一个 BlockViewer
const entryMdxComponents: MDXComponents = { ...mdxComponents, BlockViewer }

import { EntryGallery } from "@/components/sections/entry-gallery"

export type EntryRouteProps = { params: Promise<{ slug?: string[] }> }

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
  return pageMetadata({
    title: page.data.title,
    description: page.data.description,
    path: page.url,
    ogKey: page.slugs.join("/"),
  })
}

export async function EntryPage({
  section,
  params,
}: EntryRouteProps & { section: EntrySection }) {
  const { slug = [] } = await params
  const page = getPage(section, slug)
  if (slug.length === 0) return <EntryGallery section={section} />
  const Body = page.data.body
  return (
    <DocsShell
      section={section}
      url={page.url}
      title={page.data.title}
      titleEn={page.data.titleEn}
      description={page.data.description}
      markdown={await pageMarkdown(page)}
      sourcePath={page.path}
      registryName={slug[0]}
      toc={page.data.toc}
    >
      <article className="docs-prose">
        <Body components={entryMdxComponents} />
      </article>
    </DocsShell>
  )
}
