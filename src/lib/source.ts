import { docs } from "../../.source/server"
import { flattenTree } from "fumadocs-core/page-tree"
import { loader } from "fumadocs-core/source"
import { siteConfig } from "@/config/site"

// 内容语言与 URL 生成集中配置，未来增加英文时无需修改正文组件。
export const source = loader({
  baseUrl: "/",
  source: docs.toFumadocsSource(),
  i18n: {
    languages: [...siteConfig.languages],
    defaultLanguage: siteConfig.defaultLanguage,
  },
  url: (slugs, locale) =>
    `${locale && locale !== siteConfig.defaultLanguage ? `/${locale}` : ""}/${slugs.join("/")}/`,
})

export type DocsSection = "components" | "agents"
export const sections: Record<
  DocsSection,
  { title: string; description: string }
> = {
  components: {
    title: "组件",
    description:
      "从线条、留白与排版开始，构建属于自己的界面。源码开放，复制即用。",
  },
  agents: {
    title: "Agent 开发指南",
    description: "让 Agent 理解项目约定，协作构建一致的界面。",
  },
}
export function sectionPages(section: DocsSection) {
  const order = new Map(
    flattenTree(source.getPageTree(siteConfig.defaultLanguage).children).map(
      (page, index) => [page.url, index],
    ),
  )
  return source
    .getPages(siteConfig.defaultLanguage)
    .filter((page) => page.slugs[0] === section)
    .sort((a, b) => (order.get(a.url) ?? 0) - (order.get(b.url) ?? 0))
}
