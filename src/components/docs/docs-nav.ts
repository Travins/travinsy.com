import { sectionPages } from "@/lib/source"
import { sectionItems, type EntrySection } from "./registry-items"

export type NavItem = { title: string; url: string }
export type NavSectionId =
  | "docs"
  | "components"
  | "blocks"
  | "templates"
  | "agents"
export type NavGroup = { id: NavSectionId; title: string; items: NavItem[] }

/** 各分区的概览页：卡片目录，不出现在侧栏，面包屑第一级指向它。 */
export const sectionHome: Record<NavSectionId, { title: string; url: string }> = {
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
    .map((page) => ({ title: page.data.title, url: withSlash(page.url) }))
}

function entryItems(section: EntrySection): NavItem[] {
  return sectionItems(section).map((item) => ({
    title: item.title,
    url: `/${section}/${item.name}/`,
  }))
}

/** 所有文档页共用的一棵侧栏树。 */
export function docsNav(): NavGroup[] {
  const groups: NavGroup[] = [
    { id: "docs", title: sectionHome.docs.title, items: mdxItems("docs", true) },
    {
      id: "components",
      title: sectionHome.components.title,
      items: mdxItems("components", false),
    },
    {
      id: "blocks",
      title: sectionHome.blocks.title,
      items: entryItems("blocks"),
    },
    {
      id: "templates",
      title: sectionHome.templates.title,
      items: entryItems("templates"),
    },
    {
      id: "agents",
      title: sectionHome.agents.title,
      items: sectionPages("agents").map((page) => ({
        title: page.slugs.length === 1 ? "开发指南" : page.data.title,
        url: withSlash(page.url),
      })),
    },
  ]
  return groups
}

/** 上一页 / 下一页：按侧栏树的顺序跨分组连续。 */
export function docsNeighbours(url: string) {
  const flat = docsNav().flatMap((group) => group.items)
  const index = flat.findIndex((item) => item.url === withSlash(url))
  if (index < 0) return {}
  return { previous: flat[index - 1], next: flat[index + 1] }
}
