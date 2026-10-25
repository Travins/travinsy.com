import { notFound } from "next/navigation"
import type { Metadata } from "next"
import type { MDXComponents } from "mdx/types"
import { source } from "@/lib/source"
import { siteConfig } from "@/config/site"
import { DocsCard, DocsShell } from "./docs-shell"
import { BlockViewer } from "./block-viewer"
import { mdxComponents } from "./mdx-components"
import { pageMarkdown } from "./page-markdown"
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

export async function EntryPage({
  section,
  params,
}: EntryRouteProps & { section: EntrySection }) {
  const { slug = [] } = await params
  const page = getPage(section, slug)
  const items = sectionItems(section)
  const isIndex = slug.length === 0
  const Body = page.data.body
  return (
    <DocsShell
      section={section}
      url={page.url}
      title={page.data.title}
      description={isIndex ? sectionIntro[section] : page.data.description}
      overview={isIndex}
      markdown={isIndex ? undefined : await pageMarkdown(page)}
      toc={isIndex ? [] : page.data.toc}
    >
      {isIndex ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <DocsCard
              key={item.name}
              href={`/${section}/${item.name}/`}
              eyebrow={`${entrySections[section].label} / ${item.files.length} FILES`}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      ) : (
        <article className="docs-prose">
          <Body components={entryMdxComponents} />
        </article>
      )}
    </DocsShell>
  )
}
