"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/hooks/use-controllable-state"

import { AppHeader, type AppShellBrand } from "./app-header"
import { AppShellScript, type AppShellScriptProps } from "./app-shell-script"
import {
  AppShellLabelsProvider,
  DEFAULT_STORAGE_KEY,
  NAV_WIDTH_CLASS,
  NAV_WIDTH_TRANSITION,
  useAppShellLabels,
  type AppShellLabels,
} from "./config"
import type { NavLinkBehavior } from "./nav-link"
import { resolveNav, type NavConfig } from "./nav-types"
import { PrimaryNav } from "./primary-nav"
import { useStoredFlag } from "./use-stored-flag"
import type { AppShellUser } from "./user-menu"
import { WorkspaceMobileNav, WorkspaceSidebar } from "./workspace-sidebar"

type AppShellProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** 导航数据：一级导航 + 二级（工作区）侧栏，见 nav-config.ts */
  nav: NavConfig
  /** 品牌区：名称、Logo、说明与跳转地址 */
  brand?: AppShellBrand
  /** 顶栏右侧的额外操作区，例如「AI 助手」按钮、服务状态 */
  headerActions?: React.ReactNode
  /** 主区域右侧的侧栏插槽（如 AI 助手面板）：与 main 并排，高度占满顶栏以下区域 */
  aside?: React.ReactNode
  /** 当前登录用户，用于顶栏右侧的用户菜单；不传则不显示 */
  user?: AppShellUser
  /** 额外的用户菜单项（DropdownMenuItem），放在「退出登录」之前 */
  userMenu?: React.ReactNode
  /** 点击「退出登录」时的回调 */
  onSignOut?: () => void
  /** 当前地址，用于高亮导航；不传则取 usePathname() */
  activeHref?: string
  /** 传入后拦截导航链接的默认跳转并回调，适合预览 / 单页场景；接入路由时不要传 */
  onNavigate?: (payload: { href: string }) => void
  /**
   * 侧栏是否折叠（受控）；不传则内部维护并记住在 localStorage。
   * 受控时不读写 localStorage、也不注入首帧脚本：想避免首屏闪烁，
   * 请让首次渲染传入的值就是最终状态（例如服务端从 cookie 读取）。
   */
  collapsed?: boolean
  /** 非受控时的初始折叠状态（无本地记录时生效） */
  defaultCollapsed?: boolean
  /** 折叠状态变化时的回调，受控与非受控都会触发 */
  onCollapsedChange?: (collapsed: boolean) => void
  /** 非受控时记住折叠状态的 localStorage 键 */
  storageKey?: string
  /**
   * 是否显示亮暗模式切换（依赖 next-themes）
   * @default true
   */
  themeToggle?: boolean
  /** 覆盖默认文案，见 config.ts 的 DEFAULT_LABELS */
  labels?: Partial<AppShellLabels>
  /** 主区域内容 */
  children: React.ReactNode
}

const defaultBrand: AppShellBrand = { name: "控制台" }

/**
 * 企业控制台布局：固定顶栏 + 可折叠一级导航 + 可选二级工作区侧栏 + 独立滚动的主区域 + 右侧 aside 插槽。
 * 窄屏（< 768px）一级导航变为左侧 Sheet 抽屉，二级导航变为顶栏下方的横向标签条。
 */
function AppShell({
  className,
  nav,
  brand = defaultBrand,
  headerActions,
  aside,
  user,
  userMenu,
  onSignOut,
  activeHref,
  onNavigate,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  storageKey = DEFAULT_STORAGE_KEY,
  themeToggle = true,
  labels,
  children,
  ...props
}: AppShellProps) {
  const text = useAppShellLabels(labels)
  const pathname = usePathname()
  const currentHref = activeHref ?? pathname
  const active = React.useMemo(
    () => resolveNav(nav, currentHref),
    [nav, currentHref]
  )

  // 非受控时折叠状态来自 localStorage（水合安全）；受控时完全由外部决定
  const [stored, setStored] = useStoredFlag(storageKey, defaultCollapsed)
  const [collapsed, setCollapsed] = useControllableState({
    prop: collapsedProp ?? stored,
    defaultProp: defaultCollapsed,
    onChange: (next) => {
      if (collapsedProp === undefined) setStored(next)
      onCollapsedChange?.(next)
    },
  })
  const [mobileOpen, setMobileOpen] = React.useState(false)
  // 只有用户点击折叠后才开启宽度过渡，首次渲染与水合不播放动画
  const [animate, setAnimate] = React.useState(false)

  const mainRef = React.useRef<HTMLElement>(null)
  React.useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, left: 0 })
  }, [currentHref])

  const navigation = React.useMemo<NavLinkBehavior>(
    () => ({
      intercept: Boolean(onNavigate),
      onNavigate: (payload) => {
        setMobileOpen(false)
        onNavigate?.(payload)
      },
    }),
    [onNavigate]
  )

  const group = active?.module

  return (
    <TooltipProvider>
      <AppShellLabelsProvider labels={text}>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <div
            data-slot="app-shell"
            data-collapsed={collapsed ? "" : undefined}
            data-animate={animate ? "" : undefined}
            data-has-aside={aside ? "" : undefined}
            data-has-workspace={group ? "" : undefined}
            className={cn(
              "group/app-shell flex h-svh flex-col overflow-hidden bg-muted/35 text-foreground",
              className
            )}
            // 首帧脚本会在水合前改写 data-collapsed，以 DOM 为准
            suppressHydrationWarning
            {...props}
          >
            {/* 受控时折叠状态由外部决定，不能让脚本用本地记录覆盖 */}
            {collapsedProp === undefined ? (
              <AppShellScript storageKey={storageKey} />
            ) : null}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:ring-3 focus:ring-ring/50 focus:outline-none"
            >
              {text.skipToContent}
            </a>
            <AppHeader
              brand={brand}
              collapsed={collapsed}
              onToggleCollapsed={() => {
                setAnimate(true)
                setCollapsed(!collapsed)
              }}
              trail={active?.trail ?? []}
              actions={headerActions}
              themeToggle={themeToggle}
              user={user}
              userMenu={userMenu}
              onSignOut={onSignOut}
              navigation={navigation}
              labels={labels}
            />
            {group ? (
              <WorkspaceMobileNav
                module={group}
                activeId={active?.item.id}
                navigation={navigation}
                labels={labels}
              />
            ) : null}
            <div className="flex min-h-0 flex-1">
              <aside
                data-slot="app-shell-sidebar"
                data-collapsed={collapsed ? "" : undefined}
                className={cn(
                  "hidden shrink-0 border-r border-sidebar-border bg-sidebar md:flex",
                  NAV_WIDTH_CLASS.sidebar,
                  NAV_WIDTH_TRANSITION
                )}
              >
                <PrimaryNav
                  config={nav}
                  active={active}
                  collapsed={collapsed}
                  navigation={navigation}
                  labels={labels}
                />
              </aside>
              {group ? (
                <WorkspaceSidebar
                  module={group}
                  activeId={active?.item.id}
                  navigation={navigation}
                  labels={labels}
                />
              ) : null}
              <main
                data-slot="app-shell-main"
                id="main-content"
                ref={mainRef}
                tabIndex={-1}
                aria-label={text.mainContent}
                className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-background outline-none"
              >
                {children}
              </main>
              {aside}
            </div>
            <SheetContent
              side="left"
              className="gap-0 p-0 data-[side=left]:w-[280px] data-[side=left]:sm:max-w-[280px]"
            >
              <SheetHeader className="border-b border-border px-4 py-3">
                <SheetTitle className="text-sm">{text.mainNavigation}</SheetTitle>
                <SheetDescription className="sr-only">
                  {text.mainNavigationDescription}
                </SheetDescription>
              </SheetHeader>
              <div className="flex min-h-0 flex-1 bg-sidebar">
                <PrimaryNav
                  config={nav}
                  active={active}
                  navigation={navigation}
                  labels={labels}
                />
              </div>
            </SheetContent>
          </div>
        </Sheet>
      </AppShellLabelsProvider>
    </TooltipProvider>
  )
}

export { AppShell, AppShellScript }
export type {
  AppShellBrand,
  AppShellProps,
  AppShellScriptProps,
  AppShellUser,
}
