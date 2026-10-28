import * as React from "react"

import { cn } from "@/lib/utils"
import {
  formatStat,
  motionStyles,
  toneColor,
  type DataTone,
  type StatFormatOptions,
} from "@/registry/lib/data-display"

type ChartGaugeProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** 当前值 */
  value: number
  /**
   * 满值
   * @default 100
   */
  max?: number
  /**
   * 刻度数量；刻度越多越像一圈连续的光带
   * @default 60
   */
  ticks?: number
  /**
   * 刻度环的总角度：360 是整圆，270 是下方留口的仪表
   * @default 270
   */
  arc?: number
  /**
   * 点亮刻度的色调
   * @default "primary"
   */
  tone?: DataTone
  /**
   * 点亮的刻度由淡到浓渐变，最后一格最亮最长，像指针停在当前值上
   * @default true
   */
  fade?: boolean
  /** 中央大数字的格式，默认取整后的百分比 */
  format?: StatFormatOptions
  /** 中央数字下方的小字，如「达成率」 */
  caption?: React.ReactNode
  /** 中央内容，传入后替代默认的数字与小字 */
  children?: React.ReactNode
  /** 读屏名称 */
  label?: string
}

const CENTER = 100
const OUTER = 94
const TICK = 12

/**
 * 刻度式环形仪表：一圈细刻度，按值依次点亮。
 * 点亮的刻度从起点向当前值逐格淡入；服务端直接输出最终状态，淡入是纯 CSS，没有脚本也完整显示；系统开启「减少动态效果」时不播放。
 */
/** 三角函数在 Node 与浏览器里末位小数可能不同，取 3 位小数让服务端与客户端输出一致，避免水合告警。 */
function round(value: number) {
  return Math.round(value * 1000) / 1000
}

function ChartGauge({
  className,
  value,
  max = 100,
  ticks = 60,
  arc = 270,
  tone = "primary",
  fade = true,
  format,
  caption,
  children,
  label,
  ...props
}: ChartGaugeProps) {
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0
  const lit = Math.round(ratio * ticks)
  const color = toneColor(tone)
  const sweep = Math.min(360, Math.max(30, arc))
  // 角度从 12 点钟顺时针量；开口仪表让缺口落在正下方，起点在左下
  const start = sweep === 360 ? 0 : 180 + (360 - sweep) / 2
  const step = sweep === 360 ? 360 / ticks : sweep / Math.max(1, ticks - 1)

  const marks = Array.from({ length: ticks }, (_, index) => {
    const angle = ((start + index * step) * Math.PI) / 180
    const sin = Math.sin(angle)
    const cos = Math.cos(angle)
    const head = lit > 0 && index === lit - 1
    // 最后一格点亮的刻度比其余长，作为「当前值」的标记
    const length = head ? TICK + 6 : TICK
    return {
      index,
      head,
      on: index < lit,
      x1: round(CENTER + (OUTER - length) * sin),
      y1: round(CENTER - (OUTER - length) * cos),
      x2: round(CENTER + OUTER * sin),
      y2: round(CENTER - OUTER * cos),
      opacity: head || !fade || lit < 2 ? 1 : 0.3 + 0.7 * (index / (lit - 1)),
    }
  })

  return (
    <div
      data-slot="chart-gauge"
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn(
        "relative aspect-square size-44 max-w-full shrink-0",
        className,
      )}
      {...props}
    >
      {motionStyles()}
      <svg
        viewBox="0 0 200 200"
        aria-hidden="true"
        className="absolute inset-0 size-full"
      >
        {/* 稳定的淡色底环不依赖入场动画，慢网与无脚本时仍有完整轮廓。 */}
        <circle
          data-slot="chart-gauge-placeholder"
          cx={CENTER}
          cy={CENTER}
          r={OUTER - TICK / 2}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={TICK}
          pathLength={1}
          strokeDasharray={`${sweep / 360} 1`}
          transform={`rotate(${start - 90} 100 100)`}
        />
        {marks.map((mark) =>
          mark.on ? (
            <line
              key={mark.index}
              data-dd-anim="fade"
              x1={mark.x1}
              y1={mark.y1}
              x2={mark.x2}
              y2={mark.y2}
              stroke={color}
              strokeWidth={mark.head ? 3.5 : 3}
              strokeLinecap="round"
              opacity={mark.opacity}
              style={{
                animationDelay: `${Math.round((mark.index / ticks) * 700)}ms`,
              }}
            />
          ) : (
            <line
              key={mark.index}
              x1={mark.x1}
              y1={mark.y1}
              x2={mark.x2}
              y2={mark.y2}
              stroke="var(--edge)"
              strokeWidth={3}
              strokeLinecap="round"
            />
          ),
        )}
      </svg>
      <div
        data-slot="chart-gauge-content"
        className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center tabular-nums"
      >
        {children ?? (
          <>
            <span className="text-3xl leading-none font-semibold tracking-tight">
              {formatStat(ratio * 100, {
                style: "percent",
                digits: 0,
                ...format,
              })}
            </span>
            {caption ? (
              <span className="text-xs text-muted-foreground">{caption}</span>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}

export { ChartGauge }
export type { ChartGaugeProps }
