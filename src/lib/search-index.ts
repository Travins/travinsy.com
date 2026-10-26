import {
  createSearchAPI,
  type AdvancedIndex,
} from "fumadocs-core/search/server"
import { blogSource, source } from "@/lib/source"
import { searchGroup } from "@/lib/search"

export function createSiteSearch() {
  return createSearchAPI("advanced", {
    // 当前 Fumadocs 推荐方案：Intl.Segmenter 按词切分中文和拉丁文字。
    language: "multilingual",
    search: { threshold: 0 },
    indexes: async () => {
      const pages = [...source.getPages(), ...blogSource.getPages()]
      const indexes: AdvancedIndex[] = await Promise.all(
        pages.map(async (page) => ({
          id: `${page.url.replace(/\/$/, "")}/`,
          url: `${page.url.replace(/\/$/, "")}/`,
          // 中英对照条目把英文名拼进标题：既能用英文搜到，结果里也能看到
          title:
            "titleEn" in page.data && page.data.titleEn
              ? `${page.data.title} · ${page.data.titleEn}`
              : page.data.title,
          description: page.data.description,
          breadcrumbs: [searchGroup(page.url)],
          structuredData: page.data.structuredData,
        })),
      )
      indexes.push({
        id: "/themes/",
        url: "/themes/",
        title: "颜色主题",
        breadcrumbs: [searchGroup("/themes/")],
        description: "预览和安装颜色主题，搭配亮色与暗色模式构建界面。",
        structuredData: { headings: [], contents: [] },
      })
      return indexes
    },
  })
}
