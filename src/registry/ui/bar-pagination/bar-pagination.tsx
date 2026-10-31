"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cva } from "class-variance-authority"
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
  // 固定槽位：翻页时格子数量不变，分页条不抖动（算法见 pagination-slots）
  const pages = getPaginationSlots(page, count, siblings)
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
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
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
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
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
            {String(getPaginationRange(page, pageSize, total).from).padStart(
              2,
              "0",
            )}
            –
            {String(getPaginationRange(page, pageSize, total).to).padStart(
              2,
              "0",
            )}{" "}
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
                {/* 每页条数：整格就是触发器（「每页 10 ⌄」），悬停、展开时整格变色；
                    弹出层与整格同宽、左缘对齐，选项数字与格内文字同一条左边线 */}
                <Select
                  value={pageSize}
                  onValueChange={(value) => onPageSizeChange?.(Number(value))}
                >
                  <SelectTrigger className="h-full! gap-2 rounded-none border-0 bg-transparent! px-2.5 py-0 shadow-none hover:bg-background/60! focus-visible:ring-inset data-[popup-open]:bg-background/60! [&_svg]:size-3.5!">
                    <span className="text-muted-foreground">
                      {labels.perPage}
                    </span>
                    <SelectValue className="font-mono text-foreground tabular-nums" />
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
                          className="py-1 ps-1.5 pe-6 font-mono text-xs tabular-nums [&_svg]:size-3.5 [&>span:last-child]:right-1.5"
                        >
                          {n}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
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
