"use client"

import * as React from "react"
import { ChevronRightIcon } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { useAppShellLabels, type AppShellLabels } from "./config"
import { NavLink, type NavLinkBehavior } from "./nav-link"
import {
  isModule,
  moduleHref,
  type NavConfig,
  type NavEntry,
  type NavSection,
  type ResolvedNav,
} from "./nav-types"

type PrimaryNavProps = Omit<React.ComponentProps<"nav">, "children"> & {
  config: NavConfig
  /** 当前页面对应的导航位置，由 resolveNav 得到 */
  active?: ResolvedNav
  /**
   * 图标栏模式：只显示图标，名称放到 Tooltip 与读屏文本里。
   * 外观由祖先 `.group/app-shell[data-collapsed]` 决定（水合前即生效），
   * 这个 prop 只负责 Tooltip 的开关；抽屉里的导航在 AppShell 之外，始终展开。
   */
  collapsed?: boolean
  navigation?: NavLinkBehavior
  labels?: Partial<AppShellLabels>
}

/** 一级导航：分组标题 + 条目；模块条目指向其第一个子项，选中时左侧出现二级侧栏。 */
function PrimaryNav({
  className,
  config,
  active,
  collapsed = false,
  navigation,
  labels,
  ...props
}: PrimaryNavProps) {
  const text = useAppShellLabels(labels)

  function renderEntry(entry: NavEntry) {
    const isGroup = isModule(entry)
    const selected = isGroup
      ? active?.module?.id === entry.id
      : active?.item.id === entry.id
    const Icon = entry.icon
    const badge = isGroup ? undefined : entry.badge
    const link = (
      <NavLink
        data-slot="app-shell-nav-item"
        data-active={selected ? "" : undefined}
        href={isGroup ? moduleHref(entry) : entry.href}
        navigation={navigation}
        aria-current={selected ? (isGroup ? "true" : "page") : undefined}
        className={cn(
          "relative flex h-10 w-full min-w-0 items-center gap-3 rounded-md px-3 text-sm transition-colors outline-none group-data-[collapsed]/app-shell:justify-center group-data-[collapsed]/app-shell:px-2 focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none",
          selected
            ? "bg-primary/10 font-medium text-sidebar-foreground shadow-[inset_3px_0_0_var(--primary)]"
            : "text-sidebar-foreground/70 hover:bg-primary/5 hover:text-sidebar-foreground"
        )}
      >
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        {/* 折叠与否只靠 CSS 切换，水合前就是正确的外观；折叠时名称保留为读屏文本 */}
        <span className="min-w-0 flex-1 truncate group-data-[collapsed]/app-shell:sr-only">
          {entry.label}
        </span>
        {badge !== undefined ? (
          <>
            <span className="rounded-full bg-primary/10 px-1.5 text-[11px] leading-5 font-medium text-primary tabular-nums group-data-[collapsed]/app-shell:hidden">
              {badge}
            </span>
            <span
              aria-hidden="true"
              className="absolute top-2 right-2 hidden size-1.5 rounded-full bg-primary group-data-[collapsed]/app-shell:block"
            />
          </>
        ) : null}
        {isGroup ? (
          <ChevronRightIcon
            className="size-3 shrink-0 opacity-40 group-data-[collapsed]/app-shell:hidden"
            aria-hidden="true"
          />
        ) : null}
      </NavLink>
    )
    return (
      <li key={entry.id}>
        {/* 始终包一层 Tooltip，仅折叠时启用，避免折叠切换时重新挂载链接 */}
        <Tooltip disabled={!collapsed}>
          <TooltipTrigger render={link} />
          <TooltipContent side="right">{entry.label}</TooltipContent>
        </Tooltip>
      </li>
    )
  }

  function renderSection(section: NavSection) {
    return (
      <section key={section.id} aria-label={section.label}>
        <h2
          className="flex h-8 items-center px-3 text-[11px] font-medium text-sidebar-foreground/50 group-data-[collapsed]/app-shell:sr-only"
        >
          {section.label}
        </h2>
        <ul className="flex flex-col gap-1">
          {section.entries.map(renderEntry)}
        </ul>
      </section>
    )
  }

  return (
    <nav
      data-slot="app-shell-primary-nav"
      data-collapsed={collapsed ? "" : undefined}
      aria-label={text.mainNavigation}
      className={cn("flex h-full min-h-0 flex-1 flex-col", className)}
      {...props}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-2 py-4">
        {config.sections.map(renderSection)}
      </div>
      {config.footer ? (
        <div className="shrink-0 border-t border-sidebar-border px-2 py-3">
          {renderSection(config.footer)}
        </div>
      ) : null}
    </nav>
  )
}

export { PrimaryNav }
export type { PrimaryNavProps }
