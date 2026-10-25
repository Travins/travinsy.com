"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import { formatLabel, resolveLabels, type AppShellLabels } from "./config"
import { NavLink, type NavLinkBehavior } from "./nav-link"
import type { NavModule } from "./nav-types"

type WorkspaceNavProps = Omit<React.ComponentProps<"nav">, "children"> & {
  module: NavModule
  /** 当前选中的子项 id */
  activeId?: string
  navigation?: NavLinkBehavior
  labels?: Partial<AppShellLabels>
}

function WorkspaceNav({
  className,
  module: group,
  activeId,
  navigation,
  labels,
  mobile = false,
  ...props
}: WorkspaceNavProps & { mobile?: boolean }) {
  const text = resolveLabels(labels)
  const navRef = React.useRef<HTMLElement>(null)

  // 移动端是横向滚动条：让当前项保持在可视区域中间
  React.useEffect(() => {
    const nav = navRef.current
    if (!mobile || !nav) return
    function reveal() {
      const current = nav!.querySelector<HTMLElement>('a[aria-current="page"]')
      if (current && nav!.clientWidth) {
        nav!.scrollLeft =
          current.offsetLeft -
          nav!.offsetLeft -
          (nav!.clientWidth - current.clientWidth) / 2
      }
    }
    reveal()
    const observer = new ResizeObserver(reveal)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [activeId, mobile])

  return (
    <nav
      data-slot="app-shell-workspace-nav"
      data-mobile={mobile ? "" : undefined}
      ref={navRef}
      aria-label={formatLabel(text.workspaceNavigation, group.label)}
      className={cn(
        "flex",
        mobile
          ? "h-10 shrink-0 items-center gap-1.5 overflow-x-auto overflow-y-hidden border-b border-border bg-muted/20 px-3 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
          : "min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-4",
        className
      )}
      {...props}
    >
      {group.items.map((item) => {
        const active = item.id === activeId
        const Icon = item.icon
        return (
          <NavLink
            key={item.id}
            data-slot="app-shell-workspace-item"
            data-active={active ? "" : undefined}
            href={item.href}
            navigation={navigation}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-w-0 shrink-0 items-center rounded-md transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none",
              mobile
                ? "h-7 gap-1.5 px-2.5 text-xs"
                : "min-h-14 gap-2.5 px-3 py-2.5 text-sm",
              active
                ? "bg-primary/10 font-medium text-foreground shadow-[inset_3px_0_0_var(--primary)]"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon
              aria-hidden="true"
              className={mobile ? "size-3.5 shrink-0" : "size-4 shrink-0"}
            />
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate">{item.label}</span>
              {!mobile && item.description ? (
                <span className="mt-0.5 block truncate text-[11px] font-normal text-muted-foreground">
                  {item.description}
                </span>
              ) : null}
            </span>
            {!mobile && item.badge !== undefined ? (
              <span className="rounded-full bg-primary/10 px-1.5 text-[11px] leading-5 font-medium text-primary tabular-nums">
                {item.badge}
              </span>
            ) : null}
          </NavLink>
        )
      })}
    </nav>
  )
}

/** 窄屏下二级导航：Header 下方的横向滚动标签条。 */
function WorkspaceMobileNav(props: WorkspaceNavProps) {
  return <WorkspaceNav {...props} mobile />
}

/** 二级（工作区）侧栏：模块标题 + 子项列表，宽屏显示在一级导航右侧。 */
function WorkspaceSidebar({
  className,
  ...props
}: WorkspaceNavProps) {
  const { module: group, labels } = props
  const text = resolveLabels(labels)
  const GroupIcon = group.icon
  return (
    <aside
      data-slot="app-shell-workspace-sidebar"
      aria-label={formatLabel(text.workspaceSidebar, group.label)}
      className={cn(
        "hidden h-full min-h-0 w-[220px] shrink-0 flex-col border-r border-border bg-muted/20 md:flex",
        className
      )}
    >
      <div className="flex h-[76px] shrink-0 items-center gap-2.5 border-b border-border px-5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
          <GroupIcon className="size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{group.label}</p>
          {group.description ? (
            <p className="truncate text-[11px] text-muted-foreground">
              {group.description}
            </p>
          ) : null}
        </div>
      </div>
      <WorkspaceNav {...props} />
    </aside>
  )
}

export { WorkspaceMobileNav, WorkspaceSidebar }
export type { WorkspaceNavProps }
