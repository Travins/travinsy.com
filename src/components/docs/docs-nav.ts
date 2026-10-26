import { entryTitleEn, source, sectionPages } from "@/lib/source"
import { siteConfig } from "@/config/site"
import { groupEntries, type EntryGroup } from "./docs-groups"
import { sectionItems, type EntrySection } from "./registry-items"

/** titleEn 只有组件、区块、模板有：英文名。 */
export type NavItem = {
  title: string
  url: string
  titleEn?: string
}
export type NavSectionId =
  "docs" | "components" | "blocks" | "templates" | "agents"
/** 分区内的一组条目（小标题可选）；编号在整个分区内连续，不按组重置。 */
export type NavGroup = EntryGroup<NavItem>
export type NavSection = {
  id: NavSectionId
  title: string
  /** 英文标签（侧栏分区标题用，如 COMPONENTS） */
  titleEn: string
  /** 分区主页地址 */
  url: string
  groups: NavGroup[]
}

/** 各分区主页：返回链接和面包屑第一级指向它，文档介绍也列在入门侧栏。 */
export const sectionHome: Record<
  NavSectionId,
  { title: string; titleEn: string; url: string }
> = {
  docs: { title: "入门", titleEn: "Getting Started", url: "/docs/" },
  components: { title: "组件", titleEn: "Components", url: "/components/" },
  blocks: { title: "区块", titleEn: "Blocks", url: "/blocks/" },
  templates: { title: "模板", titleEn: "Templates", url: "/templates/" },
  agents: { title: "Agent 开发", titleEn: "Agents", url: "/agents/" },
}

/** fumadocs 生成的 page.url 没有末尾斜杠，而站点路由（trailingSlash）统一带斜杠。 */
export const withSlash = (url: string) => (url.endsWith("/") ? url : `${url}/`)

type GroupedItem = { item: NavItem; group?: string }

function mdxItems(section: NavSectionId, includeIndex: boolean): GroupedItem[] {
  return sectionPages(section)
    .filter((page) => includeIndex || page.slugs.length > 1)
    .map((page) => ({
      group: page.data.group,
      item: {
        title: page.data.title,
        url: withSlash(page.url),
        ...(page.data.titleEn ? { titleEn: page.data.titleEn } : {}),
      },
    }))
}

function entryItems(section: EntrySection): GroupedItem[] {
  return sectionItems(section).map((entry) => ({
    // 区块 / 模板的 group 写在各自的 MDX frontmatter 里
    group: source.getPage([section, entry.name], siteConfig.defaultLanguage)
      ?.data.group,
    item: {
      title: entry.title,
      url: `/${section}/${entry.name}/`,
      titleEn: entryTitleEn(section, entry.name),
    },
  }))
}

/** 侧栏、移动导航和相邻页共用当前分区的顺序（先按分组表排，再按分区内原顺序）。 */
export function sectionNav(section: NavSectionId): NavSection {
  const entries =
    section === "blocks" || section === "templates"
      ? entryItems(section)
      : mdxItems(section, section === "docs")
  const home = sectionHome[section]
  return {
    id: section,
    ...home,
    groups: groupEntries(section, entries, (entry) => entry.group).map(
      (group) => ({ ...group, items: group.items.map((entry) => entry.item) }),
    ),
  }
}

/** 上一页 / 下一页仅在当前分区内连续，顺序与侧栏一致。 */
export function docsNeighbours(section: NavSectionId, url: string) {
  const flat = sectionNav(section).groups.flatMap((group) => group.items)
  const index = flat.findIndex((item) => item.url === withSlash(url))
  if (index < 0) return {}
  return { previous: flat[index - 1], next: flat[index + 1] }
}
