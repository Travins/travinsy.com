"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { useInView, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/hooks/use-controllable-state"
import { flowToneStyle, type FlowTone } from "@/registry/ui/flow-diagram/tone"
import {
  ChecklistContext,
  ChecklistRowContext,
  initialStep,
  type ChecklistSize,
} from "./context"
import { Scribble } from "./scribble"

type ChecklistProps = React.ComponentProps<"div"> & {
  /**
   * 自动播放：按顺序逐条划掉，全部完成后停一会儿再重置，循环往复。
   * 播放期间条目只读；进入视口才播放，离屏、`paused`、减少动态效果时停在静态快照
   * @default false
   */
  autoplay?: boolean
  /**
   * 自动播放时两条之间的间隔（毫秒）
   * @default 1400
   */
  interval?: number
  /**
   * 全部划完后停留多久再重置（毫秒）
   * @default 2400
   */
  resetDelay?: number
  /**
   * 暂停自动播放
   * @default false
   */
  paused?: boolean
  /**
   * 尺寸：`sm` 更紧凑，适合侧栏、小卡片
   * @default "default"
   */
  size?: ChecklistSize
  /**
   * 划线与进度条的默认色调
   * @default "foreground"
   */
  tone?: FlowTone
}

/** 清单容器：提供尺寸、色调、自动播放和进度汇总，条目放在 `ChecklistList` 里。 */
function Checklist({
  className,
  autoplay = false,
  interval = 1400,
  resetDelay = 2400,
  paused = false,
  size = "default",
  tone = "foreground",
  ...props
}: ChecklistProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  const reduced = useReducedMotion()
  const [total, setTotal] = React.useState(0)
  const [step, setStep] = React.useState<number | null>(null)
  const [reported, setReported] = React.useState<Record<number, boolean>>({})

  const report = React.useCallback((index: number, checked: boolean) => {
    setReported((prev) =>
      prev[index] === checked ? prev : { ...prev, [index]: checked },
    )
  }, [])

  // 每走完一步重新排下一步：划到最后一条后停 resetDelay，再清空重来
  React.useEffect(() => {
    if (!autoplay || paused || reduced || !inView || total === 0) return
    const current = step ?? initialStep(total)
    const id = window.setTimeout(
      () => setStep(current >= total ? 0 : current + 1),
      current >= total ? resetDelay : interval,
    )
    return () => window.clearTimeout(id)
  }, [autoplay, paused, reduced, inView, total, step, interval, resetDelay])

  const value = React.useMemo(
    () => ({
      size,
      tone,
      autoplay,
      step,
      total,
      checked: Object.values(reported).filter(Boolean).length,
      setTotal,
      report,
    }),
    [size, tone, autoplay, step, total, reported, report],
  )

  return (
    <ChecklistContext.Provider value={value}>
      <div
        ref={ref}
        data-slot="checklist"
        data-size={size}
        data-autoplay={autoplay || undefined}
        className={cn("group/checklist flex flex-col", className)}
        {...props}
      />
    </ChecklistContext.Provider>
  )
}

/** 条目列表：给每个子级编号（自动播放按编号排序），并把条目数回报给 `Checklist`。 */
function ChecklistList({
  className,
  children,
  ...props
}: React.ComponentProps<"ul">) {
  const ctx = React.useContext(ChecklistContext)
  const items = React.Children.toArray(children)
  const count = items.length
  const setTotal = ctx?.setTotal
  React.useEffect(() => setTotal?.(count), [setTotal, count])
  return (
    <ul
      data-slot="checklist-list"
      className={cn("flex flex-col", className)}
      {...props}
    >
      {items.map((child, index) => (
        <ChecklistRowContext.Provider
          key={React.isValidElement(child) ? (child.key ?? index) : index}
          value={{ index, count }}
        >
          {child}
        </ChecklistRowContext.Provider>
      ))}
    </ul>
  )
}

type ChecklistItemProps = Omit<
  React.ComponentProps<"li">,
  "onChange" | "defaultChecked"
> & {
  /** 受控的勾选状态 */
  checked?: boolean
  /**
   * 非受控的初始勾选状态
   * @default false
   */
  defaultChecked?: boolean
  /** 勾选状态变化时回调 */
  onCheckedChange?: (checked: boolean) => void
  /**
   * 禁用
   * @default false
   */
  disabled?: boolean
  /**
   * 只读：能看到状态，但不能点击切换。自动播放时条目自动只读
   * @default false
   */
  readOnly?: boolean
  /** 这一条划线的色调，不传则用 `Checklist` 的 `tone` */
  tone?: FlowTone
}

/** 清单条目：Base UI 复选框配手写划线，勾选时文字被划掉并变淡。 */
function ChecklistItem({
  className,
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  readOnly = false,
  tone,
  children,
  style,
  ...props
}: ChecklistItemProps) {
  const ctx = React.useContext(ChecklistContext)
  const row = React.useContext(ChecklistRowContext)
  const [own, setOwn] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked,
    onChange: onCheckedChange,
  })
  // 自动播放时由步数决定；服务端和首次渲染用静态快照，水合后不会闪烁
  const driven = ctx?.autoplay && row
  const checked = driven
    ? row.index < (ctx.step ?? initialStep(row.count))
    : own

  const report = ctx?.report
  const index = row?.index
  React.useEffect(() => {
    if (!report || index === undefined) return
    report(index, checked)
    return () => report(index, false)
  }, [report, index, checked])

  const locked = readOnly || !!driven
  return (
    <li
      data-slot="checklist-item"
      data-checked={checked || undefined}
      data-readonly={locked || undefined}
      data-disabled={disabled || undefined}
      className={cn("group/item", className)}
      style={{ ...flowToneStyle(tone ?? ctx?.tone ?? "foreground"), ...style }}
      {...props}
    >
      <label
        className={cn(
          "flex items-center gap-3 py-2 text-sm group-data-[size=sm]/checklist:gap-2.5 group-data-[size=sm]/checklist:py-1.5 group-data-[size=sm]/checklist:text-[13px]",
          locked || disabled ? "cursor-default" : "cursor-pointer",
          disabled && "opacity-50",
        )}
      >
        <CheckboxPrimitive.Root
          checked={checked}
          onCheckedChange={(next) => setOwn(next)}
          disabled={disabled}
          readOnly={locked}
          data-slot="checklist-checkbox"
          className="group/box relative flex size-5 shrink-0 items-center justify-center rounded-md border border-input bg-background text-primary-foreground transition-colors outline-none group-data-[size=sm]/checklist:size-4 group-data-[size=sm]/checklist:rounded-[5px] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none data-checked:border-primary data-checked:bg-primary"
        >
          <CheckboxPrimitive.Indicator
            keepMounted
            data-slot="checklist-indicator"
            className="grid place-content-center"
          >
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="size-3.5 group-data-[size=sm]/checklist:size-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M3.5 8.5l3 3 6-7"
                pathLength={1}
                className="[stroke-dasharray:1_2] [stroke-dashoffset:1] [transition:stroke-dashoffset_0.25s_ease-out] group-data-checked/box:[transition-delay:0.12s] group-data-checked/box:[stroke-dashoffset:0] motion-reduce:[transition:none]"
              />
            </svg>
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        <span className="relative inline-block min-w-0 whitespace-nowrap">
          <span
            className={cn(
              "transition-colors duration-500 group-data-checked/item:text-muted-foreground motion-reduce:transition-none",
            )}
          >
            {children}
          </span>
          <Scribble checked={checked} seed={index ?? 0} />
        </span>
      </label>
    </li>
  )
}

type ChecklistProgressProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** 总条数；服务端输出时也想显示准确计数就传它，不传则等条目挂载后自动统计 */
  total?: number
  /**
   * 进度条填充的色调
   * @default "primary"
   */
  tone?: FlowTone
  /**
   * 读屏名称
   * @default "完成进度"
   */
  label?: string
}

/** 进度汇总：「已完成 / 总数」与进度条，手动勾选和自动播放都会实时更新。 */
function ChecklistProgress({
  className,
  total: totalProp,
  tone = "primary",
  label = "完成进度",
  style,
  ...props
}: ChecklistProgressProps) {
  const ctx = React.useContext(ChecklistContext)
  const total = totalProp ?? ctx?.total ?? 0
  const checked = ctx?.autoplay
    ? Math.min(total, ctx.step ?? initialStep(total))
    : (ctx?.checked ?? 0)
  const percent = total ? (checked / total) * 100 : 0
  return (
    <div
      data-slot="checklist-progress"
      className={cn("flex items-center gap-3", className)}
      style={{ ...flowToneStyle(tone), ...style }}
      {...props}
    >
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={checked}
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
      >
        <div
          data-slot="checklist-progress-fill"
          className="h-full rounded-full bg-(--flow-tone) transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="min-w-[2.5ch] text-right font-mono text-xs text-muted-foreground tabular-nums">
        {total ? `${checked}/${total}` : null}
      </span>
    </div>
  )
}

export { Checklist, ChecklistItem, ChecklistList, ChecklistProgress }
export type {
  ChecklistItemProps,
  ChecklistProgressProps,
  ChecklistProps,
  ChecklistSize,
}
