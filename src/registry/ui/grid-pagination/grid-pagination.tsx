"use client"

import * as React from "react"
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/hooks/use-controllable-state"
import {
  getPaginationRange,
  getPaginationSlots,
} from "@/registry/lib/pagination-slots"

const DEFAULT_LABELS = {
  navigation: "分页",
  first: "首页",
  previous: "上一页",
  next: "下一页",
  last: "尾页",
  perPage: "每页",
  jump: "跳至",
  pageUnit: "页",
  jumpInput: "跳转页码",
  page: (page: number) => `第 ${page} 页`,
}

type GridPaginationProps = Omit<React.ComponentProps<"nav">, "onChange"> & {
  /** 当前页，从 1 开始 */
  page?: number
  /** 初始页 @default 1 */
  defaultPage?: number
  /** 总页数，至少按 1 页展示 */
  pageCount: number
  /** 翻页回调 */
  onPageChange?: (page: number) => void
  /** 总条数；传入时信息格显示「范围 / 总数」 */
  total?: number
  /** 每页条数 @default 10 */
  pageSize?: number
  /** 可选每页条数；传入时显示每页条数格 */
  pageSizes?: readonly number[]
  /** 每页条数变化，调用方同步更新 pageCount 与 page */
  onPageSizeChange?: (size: number) => void
  /** 自定义信息格内容；不传时显示「范围 / 总数」（无 total 时显示「当前页 / 总页数」） */
  info?: React.ReactNode
  /** 显示跳页格 @default false */
  jumper?: boolean
  /** 当前页两侧页数 @default 1 */
  siblings?: number
  /** 生成真实链接；未传入时使用按钮 */
  getHref?: (page: number) => string
  /**
   * 外框：单独使用时整条带边框；放进表格等已有边线的容器时设为 false，由容器画线
   * @default true
   */
  bordered?: boolean
  /**
   * 格子高度，对应按钮 `icon` / `icon-lg` 档（32 / 36px，触屏 40 / 44px）
   * @default "default"
   */
  size?: "sm" | "default"
  /** 覆盖默认文案 */
  labels?: Partial<typeof DEFAULT_LABELS>
}

/**
 * 网格分页：整条是一行格子，信息、每页条数、首尾页、页码、跳页各占一格，格子之间用竖线分隔。
 * 底层是官方 Pagination；可单独使用，也可贴在表格底部当作最后一行。
 */
function GridPagination({
  page: pageProp,
  defaultPage = 1,
  pageCount,
  onPageChange,
  total,
  pageSize = 10,
  pageSizes,
  onPageSizeChange,
  info,
  jumper = false,
  siblings = 1,
  getHref,
  bordered = true,
  size = "default",
  labels: labelsProp,
  className,
  ...props
}: GridPaginationProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp }
  const count = Math.max(1, Math.trunc(pageCount) || 1)
  const clamp = (n: number) => Math.min(count, Math.max(1, Math.trunc(n) || 1))
  const id = React.useId()
  const [rawPage, setPage] = useControllableState({
    prop: pageProp,
    defaultProp: defaultPage,
    onChange: onPageChange,
  })
  const page = clamp(rawPage)
  const [jump, setJump] = React.useState("")
  const buttonSize = size === "sm" ? "icon" : "icon-lg"
  // 固定槽位：翻页时格子数量不变，整条不抖动
  const pages = getPaginationSlots(page, count, siblings)
  const range = total !== undefined && getPaginationRange(page, pageSize, total)
  const pad = (n: number) => String(n).padStart(2, "0")

  // 每一格：方形、无圆角，焦点环画在格子内侧
  const cell =
    "rounded-none border-0 font-mono text-xs tabular-nums focus-visible:ring-inset"
  const currentCell =
    "bg-foreground text-background hover:bg-foreground hover:text-background"

  const item = (
    n: number,
    content: React.ReactNode,
    label: string,
    disabled = false,
    current = false,
  ) =>
    getHref && !disabled ? (
      <PaginationLink
        href={getHref(n)}
        size={buttonSize}
        isActive={current}
        aria-label={label}
        className={cn(cell, current && currentCell)}
        onClick={(event) => {
          if (
            !event.metaKey &&
            !event.ctrlKey &&
            !event.shiftKey &&
            !event.altKey
          )
            setPage(n)
        }}
      >
        {content}
      </PaginationLink>
    ) : (
      <Button
        type="button"
        size={buttonSize}
        variant="ghost"
        aria-label={label}
        aria-current={current ? "page" : undefined}
        disabled={disabled}
        className={cn(cell, current && currentCell)}
        onClick={() => setPage(n)}
      >
        {content}
      </Button>
    )

  // 只在宽容器里出现的格子
  const wide = "hidden @min-[36rem]/grid-pagination:flex"

  return (
    <Pagination
      {...props}
      aria-label={labels.navigation}
      data-slot="grid-pagination"
      data-bordered={bordered ? "" : undefined}
      className={cn(
        "@container/grid-pagination mx-0 block w-full bg-background",
        bordered && "border border-edge",
        className,
      )}
    >
      <PaginationContent className="flex-wrap items-stretch gap-0 [&>li]:border-dashed [&>li]:border-edge [&>li+li]:border-s">
        <PaginationItem
          data-slot="grid-pagination-info"
          className="flex flex-1 items-center px-3 font-mono text-xs whitespace-nowrap text-muted-foreground tabular-nums @max-[36rem]/grid-pagination:basis-full @max-[36rem]/grid-pagination:border-b @max-[36rem]/grid-pagination:py-2"
        >
          {info ??
            (range ? (
              <span>
                {pad(range.from)}–{pad(range.to)} / {total}
              </span>
            ) : (
              <span>
                {page} / {count}
              </span>
            ))}
        </PaginationItem>
        {pageSizes && (
          <PaginationItem className={wide}>
            {/* 每页条数：官方 Select，触发器铺满整格；弹出层与它同宽、左缘对齐 */}
            <div className="flex items-center ps-3 text-xs whitespace-nowrap text-muted-foreground">
              <span id={`${id}-per-page`}>{labels.perPage}</span>
              <Select
                value={pageSize}
                onValueChange={(value) => onPageSizeChange?.(Number(value))}
              >
                <SelectTrigger
                  aria-labelledby={`${id}-per-page`}
                  className="h-full! w-16 justify-between gap-1 rounded-none border-0 bg-transparent! py-0 ps-2.5 pe-2 font-mono text-xs text-foreground shadow-none hover:bg-muted! focus-visible:ring-inset [&_svg]:size-3.5!"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  alignItemWithTrigger={false}
                  align="start"
                  className="w-(--anchor-width) min-w-0"
                >
                  {pageSizes
                    .filter((n) => n > 0)
                    .map((n) => (
                      <SelectItem
                        key={n}
                        value={n}
                        className="py-1 ps-1.5 pe-6 font-mono text-xs [&_svg]:size-3.5 [&>span:last-child]:right-1"
                      >
                        {n}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </PaginationItem>
        )}
        {/* 窄容器里信息格独占上一行，这一格成了第二行的行首，不再画左线 */}
        <PaginationItem className="@max-[36rem]/grid-pagination:border-s-0">
          {item(
            1,
            <ChevronFirst aria-hidden="true" />,
            labels.first,
            page === 1,
          )}
        </PaginationItem>
        <PaginationItem>
          {item(
            clamp(page - 1),
            <ChevronLeft aria-hidden="true" />,
            labels.previous,
            page === 1,
          )}
        </PaginationItem>
        {pages.map((n) => (
          <PaginationItem key={n} className={wide}>
            {typeof n === "number" ? (
              item(n, n, labels.page(n), false, n === page)
            ) : (
              <span
                aria-hidden="true"
                className={cn(
                  buttonVariants({ variant: "ghost", size: buttonSize }),
                  cell,
                  "pointer-events-none text-muted-foreground",
                )}
              >
                …
              </span>
            )}
          </PaginationItem>
        ))}
        {/* 窄容器：页码收成一格「当前页 / 总页数」，占满中间 */}
        <PaginationItem className="flex flex-1 items-center justify-center font-mono text-xs tabular-nums @min-[36rem]/grid-pagination:hidden">
          <span aria-live="polite">
            {page} / {count}
          </span>
        </PaginationItem>
        <PaginationItem>
          {item(
            clamp(page + 1),
            <ChevronRight aria-hidden="true" />,
            labels.next,
            page === count,
          )}
        </PaginationItem>
        <PaginationItem>
          {item(
            count,
            <ChevronLast aria-hidden="true" />,
            labels.last,
            page === count,
          )}
        </PaginationItem>
        {jumper && (
          // 跳页最不常用，容器再宽一些才出现，先保证信息格放得下
          <PaginationItem className="hidden @min-[44rem]/grid-pagination:flex">
            <label className="flex items-center gap-1.5 px-3 text-xs whitespace-nowrap text-muted-foreground">
              {labels.jump}
              <input
                aria-label={labels.jumpInput}
                inputMode="numeric"
                value={jump}
                onChange={(event) => setJump(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter") return
                  event.preventDefault()
                  if (!jump.trim() || !Number.isFinite(Number(jump))) return
                  const next = clamp(Number(jump))
                  setPage(next)
                  setJump("")
                  if (getHref) window.location.assign(getHref(next))
                }}
                className="h-6 w-10 rounded-sm border border-edge bg-background text-center font-mono text-base text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-xs"
              />
              {labels.pageUnit}
            </label>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}

export { GridPagination }
export type { GridPaginationProps }
