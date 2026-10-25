export const SEARCH_INDEX_URL = "/search.json"

export const searchGroups = [
  "组件",
  "区块",
  "模板",
  "Agent",
  "博客",
  "页面",
] as const
export type SearchGroup = (typeof searchGroups)[number]

export function searchGroup(url: string): SearchGroup {
  const section = url.split("/").filter(Boolean)[0]
  const groups: Record<string, SearchGroup> = {
    components: "组件",
    blocks: "区块",
    templates: "模板",
    agents: "Agent",
    blog: "博客",
  }
  return groups[section] ?? "页面"
}

export const searchShortcuts = [
  { title: "安装与使用", url: "/components/installation/" },
  { title: "浏览组件", url: "/components/" },
  { title: "颜色主题", url: "/themes/" },
  { title: "Agent 开发指南", url: "/agents/" },
]
