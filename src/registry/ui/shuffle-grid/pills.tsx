"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type ShuffleGridPillsProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  /** 分类标签，顺序即显示顺序 */
  options: { id: string; label: string }[]
  /** 当前选中的分类 id */
  value: string
  onValueChange: (id: string) => void
  /** 读屏名称 */
  label?: string
}

/** 底部分类胶囊：一行可横向滚动的按钮，选中项自动滚到中间，两端渐隐。 */
function ShuffleGridPills({
  className,
  options,
  value,
  onValueChange,
  label = "分类",
  ...props
}: ShuffleGridPillsProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  // 只在选中项变化时把它滚到中间；用 scrollTo 只动这一行，不会带着整个页面滚
  React.useEffect(() => {
    const row = ref.current
    const active = row?.querySelector<HTMLElement>("[aria-pressed=true]")
    if (!row || !active || row.scrollWidth <= row.clientWidth) return
    row.scrollTo({
      left: active.offsetLeft - (row.clientWidth - active.offsetWidth) / 2,
      behavior: reduced ? "auto" : "smooth",
    })
  }, [value, reduced])
  return (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      data-slot="shuffle-grid-pills"
      className={cn(
        // 首尾子项的 auto 外边距：放得下时整行居中，放不下时从左滚动，不会把左端挤出可视范围
        "flex [scrollbar-width:none] gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [&>:first-child]:ml-auto [&>:last-child]:mr-auto",
        className,
      )}
      {...props}
    >
      {options.map((option) => (
        <Button
          key={option.id}
          type="button"
          size="sm"
          variant="ghost"
          aria-pressed={option.id === value}
          onClick={() => onValueChange(option.id)}
          className="shrink-0 rounded-full text-muted-foreground aria-pressed:bg-primary/10 aria-pressed:text-primary"
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}

export { ShuffleGridPills }
export type { ShuffleGridPillsProps }
