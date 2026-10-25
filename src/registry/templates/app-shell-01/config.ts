/** 记住侧栏折叠状态的 localStorage 键（统一使用 travinsy: 前缀） */
const DEFAULT_STORAGE_KEY = "travinsy:app-shell:collapsed"

/**
 * 控制台布局里所有用户可见的文案。
 * 通过 AppShell 的 `labels` 覆盖其中任意几项；带 {name} 的文案用 formatLabel 填充。
 * 导航数据里的文字不在这里，见 nav-config.ts。
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
} as const

type AppShellLabels = { [Key in keyof typeof DEFAULT_LABELS]: string }

/** 合并用户传入的文案与默认文案。 */
function resolveLabels(labels?: Partial<AppShellLabels>): AppShellLabels {
  return { ...DEFAULT_LABELS, ...labels }
}

/** 把文案里的 {name} 替换成实际值。 */
function formatLabel(template: string, name: string) {
  return template.replace("{name}", name)
}

export { DEFAULT_LABELS, DEFAULT_STORAGE_KEY, formatLabel, resolveLabels }
export type { AppShellLabels }
