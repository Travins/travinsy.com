import type { LucideIcon } from "lucide-react"

/** 叶子导航项：点击后直接跳转。 */
type NavLeaf = {
  id: string
  label: string
  href: string
  icon: LucideIcon
  /** 二级侧栏里显示在标题下方的一行说明 */
  description?: string
  /** 右侧角标，例如未读数 */
  badge?: string | number
}

/** 模块：在一级导航里占一行，进入后左侧出现二级（工作区）侧栏。 */
type NavModule = {
  id: string
  label: string
  icon: LucideIcon
  /** 二级侧栏顶部的副标题 */
  description?: string
  items: NavLeaf[]
}

type NavEntry = NavLeaf | NavModule

/** 一级导航的分组：带小标题的一组条目。 */
type NavSection = {
  id: string
  label: string
  entries: NavEntry[]
}

type NavConfig = {
  /** 一级导航分组，自上而下排列 */
  sections: NavSection[]
  /** 固定在一级导航底部的分组（如「资源与帮助」），可选 */
  footer?: NavSection
}

type ResolvedNav = {
  section: NavSection
  /** 当前条目所属的模块；叶子条目直接挂在分组下时为 undefined */
  module?: NavModule
  item: NavLeaf
  /** 面包屑：分组 → 模块 → 页面 */
  trail: string[]
}

function isModule(entry: NavEntry): entry is NavModule {
  return "items" in entry
}

/** 去掉查询串、哈希与末尾斜杠，便于和 href 比较（项目使用 trailingSlash 时尤其需要）。 */
function normalizeHref(href: string) {
  const path = href.split(/[?#]/)[0] ?? ""
  return path.length > 1 ? path.replace(/\/+$/, "") : path || "/"
}

function matches(current: string, href: string) {
  const target = normalizeHref(href)
  return current === target || current.startsWith(`${target}/`)
}

/** 模块在一级导航里指向的地址：第一个子项。 */
function moduleHref(module: NavModule) {
  return module.items[0]?.href ?? "#"
}

/** 根据当前地址找到对应的分组、模块、页面；取匹配最长的 href，未命中返回 undefined。 */
function resolveNav(
  config: NavConfig,
  href: string,
): ResolvedNav | undefined {
  const current = normalizeHref(href)
  let best: ResolvedNav | undefined
  let bestLength = -1
  const visit = (section: NavSection, item: NavLeaf, module?: NavModule) => {
    if (!matches(current, item.href)) return
    const length = normalizeHref(item.href).length
    if (length <= bestLength) return
    bestLength = length
    best = {
      section,
      module,
      item,
      trail: [section.label, ...(module ? [module.label] : []), item.label],
    }
  }
  for (const section of [...config.sections, ...(config.footer ? [config.footer] : [])]) {
    for (const entry of section.entries) {
      if (isModule(entry)) {
        for (const item of entry.items) visit(section, item, entry)
      } else {
        visit(section, entry)
      }
    }
  }
  return best
}

export { isModule, moduleHref, normalizeHref, resolveNav }
export type {
  NavConfig,
  NavEntry,
  NavLeaf,
  NavModule,
  NavSection,
  ResolvedNav,
}
