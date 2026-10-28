"use client"

import * as React from "react"
import { PanelLeftIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

import {
  formatLabel,
  NAV_WIDTH_CLASS,
  NAV_WIDTH_TRANSITION,
  useAppShellLabels,
  type AppShellLabels,
} from "./config"
import { NavLink, type NavLinkBehavior } from "./nav-link"
import { ThemeToggle } from "./theme-toggle"
import { UserMenu, type AppShellUser } from "./user-menu"

type AppShellBrand = {
  name: string
  /** Logo 节点，建议 32×32 的 SVG / 图片；不传则用名称首字生成方块 */
  logo?: React.ReactNode
  /** 名称下方的一行说明，仅在侧栏展开的桌面端显示 */
  tagline?: string
  /** 点击品牌区跳转的地址，默认 "/" */
  href?: string
}

type AppHeaderProps = Omit<React.ComponentProps<"header">, "children"> & {
  brand: AppShellBrand
  collapsed: boolean
  onToggleCollapsed: () => void
  /** 面包屑：分组 → 模块 → 页面 */
  trail: string[]
  actions?: React.ReactNode
  themeToggle: boolean
  user?: AppShellUser
  userMenu?: React.ReactNode
  onSignOut?: () => void
  navigation?: NavLinkBehavior
  labels?: Partial<AppShellLabels>
}

/** 固定顶栏：左侧品牌区（宽度与一级导航对齐）+ 折叠按钮 + 面包屑 + 右侧操作区。 */
function AppHeader({
  className,
  brand,
  collapsed,
  onToggleCollapsed,
  trail,
  actions,
  themeToggle,
  user,
  userMenu,
  onSignOut,
  navigation,
  labels,
  ...props
}: AppHeaderProps) {
  const text = useAppShellLabels(labels)
  const toggleLabel = collapsed ? text.expandSidebar : text.collapseSidebar
  return (
    <header
      data-slot="app-shell-header"
      data-collapsed={collapsed ? "" : undefined}
      className={cn(
        "relative z-30 shrink-0 border-b border-sidebar-border bg-background",
        className
      )}
      {...props}
    >
      <div className="flex h-14 items-center">
        <div
          className={cn(
            "h-full shrink-0 border-r border-sidebar-border bg-sidebar px-3 sm:px-4",
            NAV_WIDTH_CLASS.brand,
            NAV_WIDTH_TRANSITION
          )}
        >
          <NavLink
            href={brand.href ?? "/"}
            navigation={navigation}
            aria-label={formatLabel(text.brandHome, brand.name)}
            className={cn(
              "flex h-full min-w-0 items-center gap-2.5 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50 max-[800px]:justify-center group-data-[collapsed]/app-shell:justify-center"
            )}
          >
            <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg">
              {brand.logo ?? (
                <span
                  aria-hidden="true"
                  className="flex size-full items-center justify-center bg-primary text-sm font-semibold text-primary-foreground"
                >
                  {brand.name.trim().slice(0, 1).toUpperCase()}
                </span>
              )}
            </span>
            <span className="hidden min-w-0 leading-tight min-[800px]:block min-[800px]:group-data-[collapsed]/app-shell:hidden">
              <span className="block truncate text-sm font-semibold">
                {brand.name}
              </span>
              {brand.tagline ? (
                <span className="block truncate text-[11px] text-muted-foreground">
                  {brand.tagline}
                </span>
              ) : null}
            </span>
          </NavLink>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-1.5 px-3 sm:px-4">
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="-ml-1 min-[800px]:hidden"
                aria-label={text.openNavigation}
              />
            }
          >
            <PanelLeftIcon />
          </SheetTrigger>
          <Button
            variant="ghost"
            size="icon"
            className="-ml-1 hidden min-[800px]:inline-flex"
            onClick={onToggleCollapsed}
            aria-label={toggleLabel}
            aria-expanded={!collapsed}
            title={toggleLabel}
          >
            <PanelLeftIcon />
          </Button>

          {trail.length > 0 ? (
            <Breadcrumb aria-label={text.breadcrumb} className="min-w-0">
              <BreadcrumbList className="flex-nowrap gap-1 overflow-hidden">
                {trail.map((label, index) => {
                  const last = index === trail.length - 1
                  return last ? (
                    <BreadcrumbItem
                      key={`${label}-${index}`}
                      className="min-w-0"
                    >
                      <BreadcrumbPage className="truncate font-semibold">
                        {label}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  ) : (
                    // 分隔符本身是 <li>，必须和 BreadcrumbItem 并列，嵌套会触发水合错误
                    <React.Fragment key={`${label}-${index}`}>
                      <BreadcrumbItem className="hidden shrink-0 lg:inline-flex">
                        {label}
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden shrink-0 lg:flex lg:items-center" />
                    </React.Fragment>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          ) : null}

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5">
            {actions}
            {themeToggle ? <ThemeToggle labels={labels} /> : null}
            {user ? (
              <UserMenu user={user} onSignOut={onSignOut} labels={labels}>
                {userMenu}
              </UserMenu>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}

export { AppHeader }
export type { AppHeaderProps, AppShellBrand }
