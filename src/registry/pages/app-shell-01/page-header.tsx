"use client"

import * as React from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { SegmentedControl } from "@/registry/ui/segmented-control/segmented-control"

import { useAppShellLabels, type AppShellLabels } from "./config"

type PageHeaderProps = Omit<React.ComponentProps<"header">, "title"> & {
  title: string
  description?: string
  /** 标题上方的小标题，通常是所属分组 */
  section?: string
  /** 右侧操作区，例如「新建」「导出」按钮 */
  actions?: React.ReactNode
}

/** 页面标题栏：分组小标题 + 标题 + 说明 + 右侧操作区，滚动时吸附在主区域顶部。 */
function PageHeader({
  className,
  title,
  description,
  section,
  actions,
  ...props
}: PageHeaderProps) {
  return (
    <header
      data-slot="app-shell-page-header"
      className={cn(
        "sticky top-0 z-20 flex min-h-[76px] shrink-0 flex-wrap items-center justify-between gap-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur @lg/main:px-6",
        className
      )}
      {...props}
    >
      <div className="min-w-0 basis-full @min-[600px]/main:basis-auto @min-[600px]/main:flex-1">
        {section ? (
          <p className="flex items-center gap-2 text-[11px] font-medium whitespace-nowrap tracking-widest text-muted-foreground">
            <span
              className="size-1.5 rounded-full bg-primary"
              aria-hidden="true"
            />
            {section}
          </p>
        ) : null}
        <div className="mt-1 flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight @lg/main:text-2xl">
            {title}
          </h1>
          {description ? (
            <p
              className="hidden min-w-0 truncate text-xs text-muted-foreground @min-[600px]/main:block"
              title={description}
            >
              {description}
            </p>
          ) : null}
        </div>
        {description ? (
          <p className="mt-1 truncate text-[11px] text-muted-foreground @min-[600px]/main:hidden">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </header>
  )
}

type PageTab = { value: string; label: string; icon?: LucideIcon }

type PageTabsProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  tabs: PageTab[]
  value: string
  onValueChange: (value: string) => void
  /** 右侧附加内容，例如时间范围说明 */
  trailing?: React.ReactNode
  labels?: Partial<AppShellLabels>
}

/**
 * 范围切换条（如「全局总览 / 应用 A / 应用 B」）：用分段选择实现。
 * 它切换的是同一页内容的数据范围，没有对应的面板，所以用单选语义而不是 tab；窄屏可横向滚动。
 */
function PageTabs({
  className,
  tabs,
  value,
  onValueChange,
  trailing,
  labels,
  ...props
}: PageTabsProps) {
  const text = useAppShellLabels(labels)
  return (
    <div
      data-slot="app-shell-page-tabs"
      className={cn(
        "flex min-w-0 items-center gap-3 border-b border-border px-4 py-2 @lg/main:px-6",
        className
      )}
      {...props}
    >
      <div className="min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <SegmentedControl
          size="sm"
          aria-label={text.scopeSwitch}
          className="w-max min-w-max"
          value={value}
          onValueChange={onValueChange}
          options={tabs.map(({ value: tab, label, icon: Icon }) => ({
            value: tab,
            label,
            icon: Icon ? <Icon /> : undefined,
          }))}
        />
      </div>
      {trailing ? (
        <div className="ml-auto hidden shrink-0 text-[11px] text-muted-foreground @min-[700px]/main:block">
          {trailing}
        </div>
      ) : null}
    </div>
  )
}

/** 页面内容区：统一内边距与纵向间距。 */
function PageContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-shell-page-content"
      className={cn("flex min-w-0 flex-col gap-5 p-4 @lg/main:p-6", className)}
      {...props}
    />
  )
}

type PageFrameProps = Omit<React.ComponentProps<"div">, "title"> &
  Pick<PageHeaderProps, "title" | "description" | "section" | "actions"> & {
    /** 标题栏下方的标签条，通常是 <PageTabs /> */
    tabs?: React.ReactNode
    /** 标题栏下方的工具栏，可组合网格工具栏 */
    toolbar?: React.ReactNode
  }

/**
 * 页面框架：标题栏 + 可选标签条 + 可选工具栏 + 内容区，一次组合完成。
 * 需要更多控制时直接使用 PageHeader / PageTabs / PageContent。
 */
function PageFrame({
  className,
  title,
  description,
  section,
  actions,
  tabs,
  toolbar,
  children,
  ...props
}: PageFrameProps) {
  return (
    <div
      data-slot="app-shell-page-frame"
      className={cn("flex min-w-0 flex-col", className)}
      {...props}
    >
      <PageHeader
        title={title}
        description={description}
        section={section}
        actions={actions}
      />
      {tabs}
      {toolbar}
      <PageContent>{children}</PageContent>
    </div>
  )
}

export { PageContent, PageFrame, PageHeader, PageTabs }
export type { PageFrameProps, PageHeaderProps, PageTab, PageTabsProps }
