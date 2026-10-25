export const SEARCH_INDEX_URL = "/search.json"

export const searchGroups = [
  "入门",
  "组件",
  "区块",
  "模板",
  "主题",
  "Agent",
  "博客",
  "页面",
] as const
export type SearchGroup = (typeof searchGroups)[number]

export function searchGroup(url: string): SearchGroup {
  const section = url.split("/").filter(Boolean)[0]
  const groups: Record<string, SearchGroup> = {
    docs: "入门",
    components: "组件",
    blocks: "区块",
    templates: "模板",
    themes: "主题",
    agents: "Agent",
    blog: "博客",
  }
  return groups[section] ?? "页面"
}

/** 空状态的快捷入口：group 决定图标。 */
export const searchShortcuts: {
  title: string
  url: string
  group: SearchGroup
}[] = [
  { title: "入门", url: "/docs/", group: "入门" },
  { title: "组件", url: "/components/", group: "组件" },
  { title: "区块", url: "/blocks/", group: "区块" },
  { title: "模板", url: "/templates/", group: "模板" },
  { title: "颜色主题", url: "/themes/", group: "主题" },
  { title: "Agent 开发指南", url: "/agents/", group: "Agent" },
  { title: "博客", url: "/blog/", group: "博客" },
]

/** `/components/grid-layout/` → `/components/grid-layout`（根路径保持 `/`）。 */
export function displayPath(url: string) {
  const path = url.split("#")[0].replace(/\/+$/, "")
  return path || "/"
}
