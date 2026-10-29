export const SITE_NAME = "Yi UI"
export const GITHUB_URL = "https://github.com/Travins/yi-ui"

/** 主导航：中文为主，labelEn 是小号等宽的英文副标。 */
export const SITE_NAV = [
  { label: "首页", labelEn: "Home", href: "/" },
  { label: "文档", labelEn: "Docs", href: "/docs/" },
  { label: "组件", labelEn: "Components", href: "/components/" },
  { label: "区块", labelEn: "Blocks", href: "/blocks/" },
  { label: "模板", labelEn: "Templates", href: "/templates/" },
  { label: "主题", labelEn: "Themes", href: "/themes/" },
  { label: "博客", labelEn: "Blog", href: "/blog/" },
] as const

export const FOOTER_LINKS = [
  { label: "RSS", href: "/rss.xml" },
  { label: "llms.txt", href: "/llms.txt" },
  { label: "GitHub", href: GITHUB_URL },
] as const

/** 仓库地址：文档页「在 GitHub 中打开」拼接源文件链接时使用 */
export const REPO_URL = "https://github.com/Travins/yi-ui"
