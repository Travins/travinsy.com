"use client"

import * as React from "react"
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
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
  // 翻页方向：页码格里的数字顺着这个方向滚动（往后翻向左滚，往前翻向右滚）
  const [previous, setPrevious] = React.useState(page)
  const [direction, setDirection] = React.useState(0)
  if (previous !== page) {
    setPrevious(page)
    setDirection(page > previous ? 1 : -1)
  }
  // 当前页的反色块：同一个实例里只有一块，翻页时滑到新位置
  const indicatorId = React.useId()
  const reduced = useReducedMotion()
  const transition = reduced
    ? { duration: 0 }
    : { type: "spring" as const, bounce: 0.15, visualDuration: 0.3 }

  // 每一格：方形、无圆角，焦点环画在格子内侧
  const cell =
    "rounded-none border-0 font-mono text-xs tabular-nums focus-visible:ring-inset"
  const currentCell =
    "text-background hover:bg-transparent hover:text-background"

  /**
   * 页码格的内容：反色块与数字分两层。数字层裁切溢出，换数字时旧的滑出、新的滑入；
   * 反色块不在裁切层里，滑过相邻格子时不会被裁掉。
   */
  const slot = (value: React.ReactNode, key: string, current: boolean) => (
    <>
      {current && (
        <motion.span
          layoutId={indicatorId}
          // 只在翻页时做动画；表格变高变矮等引起的整条位移直接跟随，不做上下滑动
          layoutDependency={page}
          aria-hidden="true"
          data-slot="grid-pagination-indicator"
          className="absolute inset-0 bg-foreground"
          transition={transition}
        />
      )}
      <span className="absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.span
            key={key}
            custom={direction}
            variants={{
              enter: (d: number) => ({ x: `${d * 70}%`, opacity: 0 }),
              center: { x: "0%", opacity: 1 },
              exit: (d: number) => ({ x: `${d * -70}%`, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className="absolute inset-0 flex items-center justify-center"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  )

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
        className={cn(cell, "relative", current && currentCell)}
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
        className={cn(cell, "relative", current && currentCell)}
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
            {/* 每页条数：整格就是触发器（「每页 10 ⌄」），悬停、展开时整格变色；
                弹出层与整格同宽、左缘对齐，选项数字与格内文字同一条左边线 */}
            <Select
              value={pageSize}
              onValueChange={(value) => onPageSizeChange?.(Number(value))}
            >
              <SelectTrigger className="h-full! gap-2 rounded-none border-0 bg-transparent! px-3 py-0 text-xs shadow-none hover:bg-muted! focus-visible:ring-inset data-[popup-open]:bg-muted! [&_svg]:size-3.5!">
                <span className="text-muted-foreground">{labels.perPage}</span>
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
                      className="py-1 ps-2 pe-6 font-mono text-xs tabular-nums [&_svg]:size-3.5 [&>span:last-child]:right-2"
                    >
                      {n}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
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
        {/* 按位置取 key：格子本身不重建，只有格里的数字滚动，反色块滑动 */}
        {pages.map((n, index) => (
          <PaginationItem key={index} className={wide}>
            {typeof n === "number" ? (
              item(
                n,
                slot(n, String(n), n === page),
                labels.page(n),
                false,
                n === page,
              )
            ) : (
              <span
                aria-hidden="true"
                className={cn(
                  buttonVariants({ variant: "ghost", size: buttonSize }),
                  cell,
                  "pointer-events-none relative text-muted-foreground",
                )}
              >
                {slot("…", n, false)}
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
