"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cva } from "class-variance-authority"
import { Button } from "@/components/ui/button"
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

const barPaginationVariants = cva(
  "flex items-center rounded-md border border-edge bg-muted/60",
  {
    variants: { size: { sm: "text-xs", default: "text-sm", lg: "text-sm" } },
    defaultVariants: { size: "default" },
  },
)
const DEFAULT_LABELS = {
  navigation: "分页",
  previous: "上一页",
  next: "下一页",
  perPage: "每页",
  jump: "跳至",
  pageUnit: "页",
  jumpInput: "跳转页码",
  page: (page: number) => `第 ${page} 页`,
}
type BarPaginationProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  /** 当前页，从 1 开始 */
  page?: number
  /** 初始页 @default 1 */
  defaultPage?: number
  /** 总页数，至少按 1 页展示 */
  pageCount: number
  /** 翻页回调 */
  onPageChange?: (page: number) => void
  /** 总条数；传入时显示范围 */
  total?: number
  /** 每页条数 @default 10 */
  pageSize?: number
  /** 可选每页条数 */
  pageSizes?: readonly number[]
  /** 每页条数变化，调用方同步更新 pageCount */
  onPageSizeChange?: (size: number) => void
  /** 显示范围 @default true */
  showRange?: boolean
  /** 显示跳页输入 @default false */
  jumper?: boolean
  /** 当前页两侧页数 @default 1 */
  siblings?: number
  /** 生成真实链接；未传入时使用按钮 */
  getHref?: (page: number) => string
  /** 高度档 @default "default" */
  size?: "sm" | "default" | "lg"
  /** 覆盖默认文案 */
  labels?: Partial<typeof DEFAULT_LABELS>
}

function BarPagination({
  page: pageProp,
  defaultPage = 1,
  pageCount,
  onPageChange,
  total,
  pageSize = 10,
  pageSizes,
  onPageSizeChange,
  showRange = true,
  jumper = false,
  siblings = 1,
  getHref,
  size = "default",
  labels: labelsProp,
  className,
  ...props
}: BarPaginationProps) {
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
  const buttonSize =
    size === "sm" ? "icon-sm" : size === "lg" ? "icon-lg" : "icon"
  const cell =
    "rounded-none border-0 font-mono tabular-nums focus-visible:ring-inset"
  const pages: (number | string)[] = []
  const radius = Math.max(0, Math.trunc(siblings) || 0)
  const numbers = [
    ...new Set([
      1,
      count,
      ...Array.from(
        { length: Math.min(count, radius * 2 + 1) },
        (_, i) => page - radius + i,
      ).filter((n) => n > 0 && n <= count),
    ]),
  ].sort((a, b) => a - b)
  for (const n of numbers) {
    const last = pages.at(-1)
    if (typeof last === "number" && n - last > 1) pages.push(`gap-${n}`)
    pages.push(n)
  }
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
        className={cn(
          cell,
          current &&
            "bg-foreground text-background hover:bg-foreground hover:text-background",
        )}
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
        className={cn(
          cell,
          current &&
            "bg-foreground text-background hover:bg-foreground hover:text-background",
        )}
        onClick={() => setPage(n)}
      >
        {content}
      </Button>
    )
  return (
    <div
      {...props}
      data-slot="bar-pagination"
      className={cn("@container/bar-pagination w-full", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {total !== undefined && showRange && (
          <p
            data-slot="bar-pagination-range"
            className="font-mono text-xs whitespace-nowrap text-muted-foreground tabular-nums"
          >
            {String(
              total > 0
                ? Math.min(total, (page - 1) * Math.max(1, pageSize) + 1)
                : 0,
            ).padStart(2, "0")}
            –
            {String(
              Math.min(Math.max(0, total), page * Math.max(1, pageSize)),
            ).padStart(2, "0")}{" "}
            / {total}
          </p>
        )}
        <Pagination
          aria-label={labels.navigation}
          className="mx-0 w-auto max-w-full"
        >
          <PaginationContent
            className={cn(
              barPaginationVariants({ size }),
              "gap-0 overflow-hidden [&>li+li]:border-l [&>li+li]:border-edge",
            )}
          >
            {pageSizes && (
              <PaginationItem className="hidden self-stretch @min-[30rem]/bar-pagination:flex">
                {/* 每页条数：官方 Select，触发器做成方条里的一格（无边框、透明底），弹出层与站点菜单同一套 */}
                <div className="flex items-center gap-1 ps-2 whitespace-nowrap text-muted-foreground">
                  <span id={`${id}-per-page`}>{labels.perPage}</span>
                  <Select
                    value={pageSize}
                    onValueChange={(value) => onPageSizeChange?.(Number(value))}
                  >
                    <SelectTrigger
                      aria-labelledby={`${id}-per-page`}
                      className="h-full! gap-1 rounded-none border-0 bg-transparent! py-0 ps-1 pe-2 font-mono text-foreground shadow-none hover:bg-background/60! focus-visible:ring-inset [&_svg]:size-3.5!"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      alignItemWithTrigger={false}
                      align="start"
                      className="w-auto min-w-20"
                    >
                      {pageSizes
                        .filter((n) => n > 0)
                        .map((n) => (
                          <SelectItem
                            key={n}
                            value={n}
                            className="py-1 font-mono text-xs"
                          >
                            {n}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </PaginationItem>
            )}
            <PaginationItem>
              {item(
                clamp(page - 1),
                <ChevronLeft aria-hidden="true" />,
                labels.previous,
                page === 1,
              )}
            </PaginationItem>
            {pages.map((n) => (
              <PaginationItem
                key={n}
                className="hidden self-stretch @min-[30rem]/bar-pagination:flex"
              >
                {typeof n === "number" ? (
                  item(n, n, labels.page(n), false, n === page)
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex min-w-8 items-center justify-center px-2 text-muted-foreground"
                  >
                    …
                  </span>
                )}
              </PaginationItem>
            ))}
            <PaginationItem className="px-4 font-mono tabular-nums @min-[30rem]/bar-pagination:hidden">
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
            {jumper && (
              <PaginationItem className="hidden self-stretch @min-[30rem]/bar-pagination:flex">
                <label className="flex items-center gap-1 px-2 whitespace-nowrap text-muted-foreground">
                  {labels.jump}
                  <input
                    aria-label={labels.jumpInput}
                    inputMode="numeric"
                    value={jump}
                    onChange={(event) => setJump(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault()
                        if (jump.trim() && Number.isFinite(Number(jump))) {
                          const next = clamp(Number(jump))
                          setPage(next)
                          setJump("")
                          if (getHref) window.location.assign(getHref(next))
                        }
                      }
                    }}
                    className="h-[calc(100%-0.5rem)] w-10 rounded-sm border border-edge bg-background text-center font-mono text-base text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
                  />
                  {labels.pageUnit}
                </label>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
export { BarPagination, barPaginationVariants }
export type { BarPaginationProps }
