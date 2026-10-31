import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ListPage } from "@/registry/pages/app-shell-01/list-page"
import { navConfig } from "@/registry/pages/app-shell-01/nav-config"
import {
  isModule,
  normalizeHref,
  resolveNav,
} from "@/registry/pages/app-shell-01/nav-types"
import { PageSummary } from "@/registry/pages/app-shell-01/page-summaries"

type Props = { params: Promise<{ slug: string[] }> }

const BASE = "/dashboard"

/** 导航里除概览以外、位于 /dashboard/ 下的全部页面地址 */
function sectionHrefs() {
  const sections = [
    ...navConfig.sections,
    ...(navConfig.footer ? [navConfig.footer] : []),
  ]
  return sections
    .flatMap((section) => section.entries)
    .flatMap((entry) => (isModule(entry) ? entry.items : [entry]))
    .map((item) => normalizeHref(item.href))
    .filter((href) => href.startsWith(`${BASE}/`))
}

/** 只认导航里登记过的地址；其他路径交给 404 */
function resolveSection(slug: string[]) {
  const href = `${BASE}/${slug.join("/")}`
  const active = resolveNav(navConfig, href)
  return active && normalizeHref(active.item.href) === href ? active : undefined
}

export const dynamicParams = false

export function generateStaticParams() {
  return sectionHrefs().map((href) => ({
    slug: href.slice(BASE.length + 1).split("/"),
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const active = resolveSection((await params).slug)
  return { title: active?.item.label }
}

/**
 * 导航中其余页面的占位实现：按地址找到导航项，显示通用列表页与该页的数据摘要。
 * 开发真实页面时，在 app/(app)/dashboard/ 下新建同名路由即可，具体路由优先于这个兜底页。
 */
export default async function SectionPage({ params }: Props) {
  const active = resolveSection((await params).slug)
  if (!active) notFound()
  return (
    <ListPage
      section={active.trail.at(-2)}
      title={active.item.label}
      description={active.item.description}
      summary={<PageSummary id={active.item.id} />}
    />
  )
}
