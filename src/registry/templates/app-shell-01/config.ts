"use client"

import { createContext, createElement, useContext, type ReactNode } from "react"

/** 记住侧栏折叠状态的 localStorage 键（统一使用 travinsy: 前缀） */
const DEFAULT_STORAGE_KEY = "travinsy:app-shell:collapsed"

/**
 * 一级导航的宽度类名，只在这里定义一次：
 * app-shell.tsx 的侧栏与 app-header.tsx 的品牌区共用，顶栏才能和导航对齐。
 * Tailwind 需要看到完整类名，所以写字面量而不是拼接。
 */
const NAV_WIDTH_CLASS = {
  expanded: "w-[200px]",
  collapsed: "w-[60px]",
  /** 窄屏下顶栏品牌区始终按图标栏宽度 */
  mobile: "max-md:w-[60px]",
} as const

/** 宽度变化时的过渡，和宽度放在一起，避免两处不一致。 */
const NAV_WIDTH_TRANSITION =
  "transition-[width] duration-200 motion-reduce:transition-none"

/**
 * 控制台布局里所有用户可见的文案。
 * 通过 AppShell 的 `labels` 覆盖其中任意几项；带占位符的文案用 formatLabel 填充。
 * 导航数据里的文字不在这里，见 nav-config.ts；演示数据见 sample-data.ts。
 */
const DEFAULT_LABELS = {
  skipToContent: "跳转到主内容",
  mainContent: "主内容",
  mainNavigation: "主导航",
  mainNavigationDescription: "选择要访问的页面",
  openNavigation: "打开导航",
  collapseSidebar: "收起侧边栏",
  expandSidebar: "展开侧边栏",
  breadcrumb: "面包屑",
  brandHome: "{name}，回到首页",
  workspaceNavigation: "{name}导航",
  workspaceSidebar: "{name}侧栏",
  toggleTheme: "切换亮暗模式",
  userMenu: "用户菜单：{name}",
  signOut: "退出登录",
  pageToolbar: "列表控制",
  totalUnit: "条",
  previousPage: "上一页",
  nextPage: "下一页",
  search: "搜索",
  serviceStatus: "服务状态",
  serviceStatusAria: "查看服务状态：{name}",
  checkedAt: "检查于 {name}",
  stateHealthy: "可用",
  stateWarning: "需关注",
  stateUnavailable: "不可用",
  stateUnknown: "未知",
  // 概览仪表盘
  overviewSection: "工作台",
  overviewTitle: "概览",
  overviewDescription: "近 24 小时的拨测质量与告警情况",
  exportAction: "导出",
  refreshAction: "刷新",
  keyMetrics: "关键指标",
  latencyTrend: "响应耗时趋势",
  latencyTrendUnit: "每小时 P50，单位 ms",
  latencyChartLabel: "过去 24 小时响应耗时，最高 {max} 毫秒，最低 {min} 毫秒",
  recentEvents: "最近事件",
  recentEventsCount: "按时间倒序，共 {count} 条",
  eventsCaption: "最近拨测事件",
  // 列表与表格
  createAction: "新建",
  searchEvents: "搜索应用或目标",
  listCaption: "{title}列表",
  emptyRows: "没有匹配的记录",
  columnApp: "应用",
  columnTarget: "目标",
  columnStatus: "状态",
  columnLatency: "耗时",
  columnTime: "时间",
  // 事件状态
  eventOk: "正常",
  eventWarning: "需关注",
  eventError: "异常",
} as const

type AppShellLabels = { [Key in keyof typeof DEFAULT_LABELS]: string }

/** 合并用户传入的文案与默认文案。 */
function resolveLabels(labels?: Partial<AppShellLabels>): AppShellLabels {
  return { ...DEFAULT_LABELS, ...labels }
}

/**
 * 把文案里的占位符替换成实际值。
 * 传字符串时等价于替换 `{name}`（保持早期写法可用）；传对象可一次替换多个，如 `{ count: 3 }`。
 */
function formatLabel(
  template: string,
  values: string | Record<string, string | number>,
): string {
  if (typeof values === "string") return template.replace("{name}", values)
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  )
}

/** AppShell 向下提供的文案，让主区域里的页面组件也能拿到同一套覆盖值。 */
const AppShellLabelsContext = createContext<Partial<AppShellLabels> | undefined>(
  undefined,
)

function AppShellLabelsProvider({
  labels,
  children,
}: {
  labels?: Partial<AppShellLabels>
  children: ReactNode
}) {
  // 本文件是 .ts（不含 JSX），用 createElement 渲染 Provider
  return createElement(AppShellLabelsContext.Provider, { value: labels }, children)
}

/**
 * 读取当前文案：组件自己的 labels > AppShell 提供的 labels > DEFAULT_LABELS。
 * 页面组件（PageHeader、PageToolbar 等）放在 AppShell 里时会自动继承 AppShell 的文案。
 */
function useAppShellLabels(labels?: Partial<AppShellLabels>): AppShellLabels {
  const inherited = useContext(AppShellLabelsContext)
  return resolveLabels({ ...inherited, ...labels })
}

export {
  AppShellLabelsProvider,
  DEFAULT_LABELS,
  DEFAULT_STORAGE_KEY,
  NAV_WIDTH_CLASS,
  NAV_WIDTH_TRANSITION,
  formatLabel,
  resolveLabels,
  useAppShellLabels,
}
export type { AppShellLabels }
