import {
  AtSign,
  Bot,
  Columns3,
  Component,
  IdCard,
  PanelLeft,
  LayoutGrid,
  Link2,
  LogIn,
  Signature,
  SunMoon,
  Clock,
  Workflow,
  createLucideIcon,
  type LucideIcon,
  type LucideProps,
} from "lucide-react"

// 自绘图标用 createLucideIcon 生成：默认 24 视口、stroke 2、currentColor，
// 与 lucide 内置图标同一套 props（size、strokeWidth、className），可以混用。

/** 线条网格布局：两横两竖的线条穿过整块区域，线头伸出，像一张留出边距的网格纸。 */
const GridLayoutIcon = createLucideIcon("entry-grid-layout", [
  ["path", { d: "M8 3v18", key: "v1" }],
  ["path", { d: "M16 3v18", key: "v2" }],
  ["path", { d: "M3 8h18", key: "h1" }],
  ["path", { d: "M3 16h18", key: "h2" }],
  ["path", { d: "M11 12h2", key: "dot" }],
])

/** 等轴测标志：一块挤出的薄板，顶面菱形加两个侧面。 */
const IsometricMarkIcon = createLucideIcon("entry-isometric-mark", [
  ["path", { d: "M12 4 21 8.5 12 13 3 8.5Z", key: "top" }],
  ["path", { d: "M3 8.5V12l9 4.5 9-4.5V8.5", key: "side" }],
  ["path", { d: "M12 13v3.5", key: "edge" }],
  ["path", { d: "m8.5 7.8 5 2.4", key: "hatch" }],
])

// 条目名（registry / MDX 文件名）→ 图标。新增条目时在这里登记，未登记的回落到通用图标。
const entryIcons: Record<string, LucideIcon> = {
  // 组件
  "grid-layout": GridLayoutIcon,
  "local-time": Clock,
  greeting: SunMoon,
  "follow-me": Signature,
  "isometric-mark": IsometricMarkIcon,
  "flow-diagram": Workflow,
  "icon-link": Link2,
  // 区块
  "profile-hero": IdCard,
  "social-follow": AtSign,
  "feature-columns": Columns3,
  "auth-01": LogIn,
  "agent-chat-01": Bot,
  // 模板
  "app-shell-01": PanelLeft,
  "portfolio-grid": LayoutGrid,
}

/** 组件、区块、模板的专属图标；装饰用，默认对读屏隐藏。 */
function EntryIcon({ name, ...props }: LucideProps & { name: string }) {
  const Icon = entryIcons[name] ?? Component
  return <Icon aria-hidden="true" {...props} />
}

export { EntryIcon, entryIcons }
