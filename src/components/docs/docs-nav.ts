import { entryTitleEn, sectionPages } from "@/lib/source"
import { sectionItems, type EntrySection } from "./registry-items"

/** titleEn / icon 只有组件、区块、模板有：英文副标与专属图标（icon 是条目名）。 */
export type NavItem = {
  title: string
  url: string
  titleEn?: string
  icon?: string
}
export type NavSectionId =
  "docs" | "components" | "blocks" | "templates" | "agents"
export type NavGroup = { id: NavSectionId; title: string; items: NavItem[] }

/** 各分区主页：返回链接和面包屑第一级指向它，文档介绍也列在入门侧栏。 */
export const sectionHome: Record<NavSectionId, { title: string; url: string }> =
  {
    docs: { title: "入门", url: "/docs/" },
    components: { title: "组件", url: "/components/" },
    blocks: { title: "区块", url: "/blocks/" },
    templates: { title: "模板", url: "/templates/" },
    agents: { title: "Agent 开发", url: "/agents/" },
  }

/** fumadocs 生成的 page.url 没有末尾斜杠，而站点路由（trailingSlash）统一带斜杠。 */
export const withSlash = (url: string) => (url.endsWith("/") ? url : `${url}/`)

function mdxItems(section: NavSectionId, includeIndex: boolean): NavItem[] {
  return sectionPages(section)
    .filter((page) => includeIndex || page.slugs.length > 1)
    .map((page) => ({
      title: page.data.title,
      url: withSlash(page.url),
      ...(page.data.titleEn
        ? { titleEn: page.data.titleEn, icon: page.slugs.at(-1) }
        : {}),
    }))
}

function entryItems(section: EntrySection): NavItem[] {
  return sectionItems(section).map((item) => ({
    title: item.title,
    url: `/${section}/${item.name}/`,
    titleEn: entryTitleEn(section, item.name),
    icon: item.name,
  }))
}

/** 侧栏、移动导航和相邻页共用当前分区的顺序。 */
export function sectionNav(section: NavSectionId): NavGroup[] {
  const items =
    section === "blocks" || section === "templates"
      ? entryItems(section)
      : mdxItems(section, section === "docs")
  return [{ id: section, title: sectionHome[section].title, items }]
}

/** 上一页 / 下一页仅在当前分区内连续。 */
export function docsNeighbours(section: NavSectionId, url: string) {
  const flat = sectionNav(section).flatMap((group) => group.items)
  const index = flat.findIndex((item) => item.url === withSlash(url))
  if (index < 0) return {}
  return { previous: flat[index - 1], next: flat[index + 1] }
}
