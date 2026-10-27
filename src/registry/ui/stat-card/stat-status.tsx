import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { toneColor, type DataTone } from "@/registry/lib/data-display"

import {
  DEFAULT_LABELS,
  STATUS_ICONS,
  STATUS_TONES,
  type StatLabels,
  type StatStatusName,
} from "./config"

// 浅色下多彩色调直接当文字色对比度偏低，向前景色混入一部分压深；暗色下同样的混合会略微提亮，两边都清晰。
const TONE_TEXT =
  "text-[color:color-mix(in_oklab,var(--stat-tone)_72%,var(--foreground))]"

function toneVars(tone: DataTone, style?: React.CSSProperties) {
  return { "--stat-tone": toneColor(tone), ...style } as React.CSSProperties
}

type StatStatusProps = useRender.ComponentProps<"div"> & {
  /** 状态：达标 / 关注 / 风险 / 审核中，决定图标、色调和默认文字 */
  status: StatStatusName
  /** 覆盖状态文字 */
  label?: string
  /** 覆盖四种状态的默认文字 */
  labels?: Partial<StatLabels>
  /**
   * 右侧显示 `>` 箭头，配合 `render` 做成可点击的入口
   * @default false
   */
  showChevron?: boolean
}

/**
 * 状态行：状态图标方块 + 两行文字（上：说明，如「3/5 个目标」；下：状态名）。
 * 想让整行可点击，用 `render={<a href="…" />}` 换成链接。
 */
function StatStatus({
  className,
  status,
  label,
  labels,
  showChevron = false,
  render,
  children,
  style,
  ...props
}: StatStatusProps) {
  const Icon = STATUS_ICONS[status]
  const text = label ?? { ...DEFAULT_LABELS, ...labels }[status]
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        className: cn(
          "flex w-full items-center gap-3 rounded-md bg-muted/50 px-3 py-2 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          render && "hover:bg-muted",
          className,
        ),
        style: toneVars(STATUS_TONES[status], style),
        children: (
          <>
            <span
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[color:var(--stat-tone)] text-background [&_svg]:size-4"
            >
              <Icon />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-xs leading-4 font-medium">
              <span className="truncate text-foreground">{children}</span>
              <span className={TONE_TEXT}>{text}</span>
            </span>
            {showChevron ? (
              <ChevronRight
                aria-hidden="true"
                className="size-4 shrink-0 text-muted-foreground"
              />
            ) : null}
          </>
        ),
      },
      {
        "data-slot": "stat-status",
        "data-status": status,
        ...props,
      } as React.ComponentProps<"div">,
    ),
  })
}

type StatBadgeProps = React.ComponentProps<"span"> & {
  /** 用状态决定色调与默认文字；与 `tone` 二选一 */
  status?: StatStatusName
  /** 直接指定色调 */
  tone?: DataTone
  /** 覆盖四种状态的默认文字 */
  labels?: Partial<StatLabels>
}

/** 状态徽标：色点 + 文字的小药丸。颜色之外永远有文字，不依赖颜色传达状态。 */
function StatBadge({
  className,
  status,
  tone,
  labels,
  style,
  children,
  ...props
}: StatBadgeProps) {
  const color = tone ?? (status ? STATUS_TONES[status] : "muted")
  return (
    <span
      data-slot="stat-badge"
      data-status={status}
      className={cn(
        "inline-flex h-5 w-fit shrink-0 items-center gap-1.5 rounded-full border border-edge px-2 text-xs font-medium whitespace-nowrap text-foreground",
        className,
      )}
      style={toneVars(color, style)}
      {...props}
    >
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full bg-[color:var(--stat-tone)]"
      />
      {children ?? (status ? { ...DEFAULT_LABELS, ...labels }[status] : null)}
    </span>
  )
}

export { StatBadge, StatStatus }
export type { StatBadgeProps, StatStatusProps }
