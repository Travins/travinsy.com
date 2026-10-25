export const SITE_NAME = "travinsy"
export const GITHUB_URL = "https://github.com/travinsy"

export const SITE_NAV = [
  { label: "组件", href: "/components/" },
  { label: "区块", href: "/blocks/" },
  { label: "模板", href: "/templates/" },
  { label: "主题", href: "/themes/" },
  { label: "Agent", href: "/agents/" },
  { label: "博客", href: "/blog/" },
] as const

export const FOOTER_LINKS = [
  { label: "RSS", href: "/rss.xml" },
  { label: "llms.txt", href: "/llms.txt" },
  { label: "GitHub", href: GITHUB_URL },
] as const
