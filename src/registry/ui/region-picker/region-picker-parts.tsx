import * as React from "react"
import { cva } from "class-variance-authority"
import { ChevronRight, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import type { RegionOption } from "./types"

/** 触发器外观与 shadcn Input 同一套，高度只用既有三档：28 / 32 / 36px */
const regionPickerTriggerVariants = cva(
  "flex w-full min-w-0 items-center gap-2 rounded-lg border border-input bg-transparent text-left transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-popup-open:border-ring data-popup-open:ring-3 data-popup-open:ring-ring/50 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      size: {
        sm: "h-7 px-2 text-base md:text-sm",
        default: "h-8 px-2.5 text-base md:text-sm",
        lg: "h-9 px-3 text-base",
      },
    },
    defaultVariants: { size: "default" },
  },
)

/** 按区间高亮一段文字，区间为空时原样输出 */
function RegionPickerHighlight({
  text,
  range,
}: {
  text: string
  range?: [number, number]
}) {
  if (!range || range[0] >= range[1]) return text
  return (
    <>
      {text.slice(0, range[0])}
      <mark
        data-slot="region-picker-mark"
        className="rounded-xs bg-primary/15 px-px text-foreground"
      >
        {text.slice(range[0], range[1])}
      </mark>
      {text.slice(range[1])}
    </>
  )
}

/** 层级标签条：已选的层级显示名称，当前层级显示占位，点击可回到该层 */
function RegionPickerLevels({
  trail,
  currentLabel,
  pendingLabel,
  ariaLabel,
  onSelect,
}: {
  /** 已经确定的上级，从最顶层开始 */
  trail: RegionOption[]
  /** 当前层级已选中的名称，没有则显示占位 */
  currentLabel?: string
  pendingLabel: string
  ariaLabel: string
  /** 回到第 `level` 层（0 = 最顶层） */
  onSelect: (level: number) => void
}) {
  return (
    <nav
      data-slot="region-picker-levels"
      aria-label={ariaLabel}
      className="-mx-0.5 flex gap-1 overflow-x-auto px-0.5 py-0.5"
    >
      {trail.map((node, level) => (
        <Button
          key={node.code}
          type="button"
          variant="ghost"
          size="sm"
          data-slot="region-picker-level"
          title={node.name}
          className="max-w-[8rem] shrink-0 justify-start"
          onClick={() => onSelect(level)}
        >
          <span className="truncate">{node.name}</span>
        </Button>
      ))}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        data-slot="region-picker-level"
        data-current=""
        aria-current="step"
        title={currentLabel}
        className="max-w-[8rem] shrink-0 justify-start"
        // 当前层级点了没有动作，保持可聚焦让读屏能读到 aria-current
        onClick={() => onSelect(trail.length)}
      >
        <span
          className={cn("truncate", !currentLabel && "text-muted-foreground")}
        >
          {currentLabel ?? pendingLabel}
        </span>
      </Button>
    </nav>
  )
}

/** 列表中的一项。鼠标按下不抢走搜索框的焦点，选项的“焦点”由 aria-activedescendant 表达 */
function RegionPickerOption({
  className,
  active,
  selected,
  branch,
  onSelect,
  onHover,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "onSelect"> & {
  active: boolean
  selected: boolean
  /** 还有下级：右侧显示箭头，点击是进入下一级 */
  branch: boolean
  onSelect: () => void
  onHover: () => void
}) {
  return (
    <div
      role="option"
      aria-selected={selected}
      data-slot="region-picker-option"
      data-active={active ? "" : undefined}
      data-selected={selected ? "" : undefined}
      className={cn(
        "flex h-7 min-w-0 cursor-pointer items-center gap-1.5 rounded-md px-2 text-sm select-none data-selected:bg-accent data-selected:font-medium data-selected:text-accent-foreground data-active:bg-muted data-active:ring-2 data-active:ring-ring/40",
        className,
      )}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onSelect}
      onMouseMove={onHover}
      {...props}
    >
      {children}
      {branch && (
        <ChevronRight
          aria-hidden="true"
          className="ml-auto size-3.5 shrink-0 text-muted-foreground"
        />
      )}
    </div>
  )
}

/** 加载中、出错、无结果的占位，高度固定避免浮层来回跳 */
function RegionPickerNotice({
  loading,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { loading?: boolean }) {
  return (
    <div
      data-slot="region-picker-notice"
      className={cn(
        "flex min-h-24 flex-col items-center justify-center gap-2 px-3 text-center text-sm text-muted-foreground",
        className,
      )}
      {...props}
    >
      {loading && (
        <Loader2
          aria-hidden="true"
          className="size-4 motion-safe:animate-spin"
        />
      )}
      {children}
    </div>
  )
}

export {
  RegionPickerHighlight,
  RegionPickerLevels,
  RegionPickerNotice,
  RegionPickerOption,
  regionPickerTriggerVariants,
}
