import * as React from "react"
import { cva } from "class-variance-authority"
import { Check, ChevronRight, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

/** 浮层形态：手机与触屏用底部面板，桌面用输入框下方的浮层 */
type RegionPickerVariant = "sheet" | "popover"

/**
 * 触发器是一条方条：与方条开关、分段选择同一套外观（浅灰底、细边框、标签在条内左侧），
 * 放进同一个面板里能对齐。高度只用既有三档：28 / 32 / 36px
 */
const regionPickerTriggerVariants = cva(
  "flex w-full min-w-0 items-center gap-3 rounded-md border border-edge bg-muted/60 px-3 text-left transition-colors outline-none select-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-popup-open:bg-muted data-popup-open:ring-3 data-popup-open:ring-ring/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      size: {
        sm: "h-7 text-xs",
        default: "h-8 text-sm",
        lg: "h-9 text-sm",
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

type RegionPickerStep = {
  /** 这一步的名称，如「城市」 */
  label: string
  /** 已完成显示所选名称；当前步显示「请选择城市」或重新打开时的已选名称 */
  value?: string
  state: "done" | "current" | "todo"
}

/**
 * 步骤条：①省份 ②城市 ③区县。已完成的步骤可点，回到那一步重选；后面的步骤灰显，让人一开始就知道要选几步。
 * 底部面板里竖排（每步一行 44px，好点），桌面浮层里横排省高度。
 */
function RegionPickerSteps({
  steps,
  variant,
  ariaLabel,
  onSelect,
}: {
  steps: RegionPickerStep[]
  variant: RegionPickerVariant
  ariaLabel: string
  /** 回到第 `index` 步（0 = 第一步） */
  onSelect: (index: number) => void
}) {
  const sheet = variant === "sheet"
  return (
    <ol
      data-slot="region-picker-steps"
      aria-label={ariaLabel}
      className={cn(
        sheet
          ? "flex flex-col px-2"
          : "flex min-w-0 items-center gap-0.5 overflow-x-auto px-2.5",
      )}
    >
      {steps.map((step, index) => {
        const done = step.state === "done"
        const current = step.state === "current"
        const last = index === steps.length - 1
        return (
          <li
            key={index}
            data-slot="region-picker-step"
            data-state={step.state}
            className={cn(
              "relative flex min-w-0",
              sheet ? "" : "shrink-0 items-center gap-0.5",
            )}
          >
            {/* 竖排时圆点之间的连线：上一步完成后变成主题色 */}
            {sheet && !last && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-[1.875rem] bottom-[-0.875rem] left-[1.125rem] w-px",
                  done ? "bg-primary" : "bg-border",
                )}
              />
            )}
            <button
              type="button"
              disabled={!done}
              aria-current={current ? "step" : undefined}
              onClick={() => onSelect(index)}
              // 当前步不能点，但要保持可读：disabled 只给未完成的步骤
              className={cn(
                "flex min-w-0 items-center text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-default",
                sheet
                  ? "h-11 w-full gap-3 rounded-lg px-2 active:bg-muted"
                  : "h-8 max-w-[11rem] gap-1.5 rounded-md px-1.5 enabled:hover:bg-muted",
                // 当前这一步垫一层底色：默认主题的主色接近黑色，只靠颜色区分不够醒目
                current && "bg-muted",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] tabular-nums",
                  done && "border-primary bg-primary text-primary-foreground",
                  current &&
                    "border-primary bg-background text-primary ring-3 ring-primary/15",
                  step.state === "todo" &&
                    "border-border bg-background text-muted-foreground",
                )}
              >
                {done ? (
                  <Check className="size-3" strokeWidth={3} />
                ) : (
                  index + 1
                )}
              </span>
              {sheet && (
                <span className="w-10 shrink-0 text-xs text-muted-foreground">
                  {step.label}
                </span>
              )}
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-sm",
                  done && "text-foreground",
                  current && "font-medium text-primary",
                  step.state === "todo" && "text-muted-foreground",
                )}
              >
                {/* 竖排时左边已经有步骤名，未到的步骤不再重复 */}
                {step.value ?? (sheet ? "" : step.label)}
              </span>
              {sheet && done && (
                <ChevronRight
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground"
                />
              )}
            </button>
            {!sheet && !last && (
              <ChevronRight
                aria-hidden="true"
                className="size-3.5 shrink-0 text-muted-foreground/60"
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

/**
 * 列表中的一项。鼠标按下不抢走搜索框的焦点，选项的“焦点”由 aria-activedescendant 表达。
 * 面板里是 44px 高的整行；浮层里是带边框的紧凑按钮，看得出能点。
 */
function RegionPickerOption({
  className,
  variant,
  layout,
  active,
  selected,
  branch,
  onSelect,
  onHover,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "onSelect"> & {
  variant: RegionPickerVariant
  /** `row` 整行（面板、搜索结果）；`chip` 浮层里浏览时的紧凑按钮 */
  layout: "row" | "chip"
  active: boolean
  selected: boolean
  /** 还有下级：整行形态右侧显示箭头 */
  branch: boolean
  onSelect: () => void
  onHover: () => void
}) {
  const sheet = variant === "sheet"
  return (
    <div
      role="option"
      aria-selected={selected}
      data-slot="region-picker-option"
      data-active={active ? "" : undefined}
      data-selected={selected ? "" : undefined}
      className={cn(
        "flex min-w-0 cursor-pointer items-center gap-2 select-none",
        layout === "chip"
          ? "h-8 rounded-md border border-border px-2.5 text-sm transition-colors hover:border-foreground/25 hover:bg-muted data-selected:border-primary data-selected:bg-primary/10 data-selected:font-medium data-selected:text-primary data-active:border-ring data-active:ring-2 data-active:ring-ring/30"
          : sheet
            ? "h-11 px-4 text-sm active:bg-muted data-selected:font-medium data-selected:text-primary"
            : "h-8 rounded-md px-2.5 text-sm data-selected:font-medium data-selected:text-primary data-active:bg-muted",
        className,
      )}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onSelect}
      onMouseMove={onHover}
      {...props}
    >
      {children}
      {layout === "row" &&
        (selected ? (
          <Check
            aria-hidden="true"
            className="ml-auto size-4 shrink-0 text-primary"
          />
        ) : (
          branch && (
            <ChevronRight
              aria-hidden="true"
              className="ml-auto size-4 shrink-0 text-muted-foreground/60"
            />
          )
        ))}
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
        "flex min-h-32 flex-col items-center justify-center gap-2 px-3 text-center text-sm text-muted-foreground",
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
  RegionPickerNotice,
  RegionPickerOption,
  RegionPickerSteps,
  regionPickerTriggerVariants,
}
export type { RegionPickerStep, RegionPickerVariant }
