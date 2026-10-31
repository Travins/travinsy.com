"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import { useAppShellLabels, type AppShellLabels } from "./config"

type PageToolbarProps = Omit<React.ComponentProps<"section">, "children"> & {
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  search?: string
  onSearchChange?: (value: string) => void
  /** 搜索框的无障碍名称与占位文字，默认取 labels.search */
  searchLabel?: string
  /** 搜索框旁边的筛选控件，例如 Select、Popover */
  filters?: React.ReactNode
  labels?: Partial<AppShellLabels>
}

/**
 * 列表页工具栏：总数 + 翻页 + 搜索 + 自定义筛选项（filters 插槽）。
 * 状态完全受控，数据请求与过滤逻辑由页面自己负责。
 */
function PageToolbar({
  className,
  total,
  page,
  pageSize,
  onPageChange,
  search,
  onSearchChange,
  searchLabel,
  filters,
  labels,
  ...props
}: PageToolbarProps) {
  const text = useAppShellLabels(labels)
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const searchName = searchLabel ?? text.search
  return (
    <section
      data-slot="app-shell-page-toolbar"
      aria-label={text.pageToolbar}
      className={cn(
        "flex min-h-14 shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-border px-4 py-3 sm:px-6",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium tabular-nums">
          {total} {text.totalUnit}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={text.previousPage}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeftIcon />
          </Button>
          <span className="min-w-14 text-center text-xs text-muted-foreground tabular-nums">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={text.nextPage}
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
      <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto">
        {onSearchChange ? (
          <div className="relative min-w-36 flex-1 sm:w-64 sm:flex-none">
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              value={search ?? ""}
              onChange={(event) => onSearchChange(event.target.value)}
              aria-label={searchName}
              placeholder={`${searchName}…`}
              className="pl-8 text-xs md:text-xs"
            />
          </div>
        ) : null}
        {filters}
      </div>
    </section>
  )
}

export { PageToolbar }
export type { PageToolbarProps }
