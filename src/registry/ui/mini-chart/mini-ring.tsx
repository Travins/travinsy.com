"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import {
  formatStat,
  toneColor,
  type DataTone,
} from "@/registry/lib/data-display"

type MiniRingProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** 当前值 */
  value: number
  /**
   * 满值
   * @default 100
   */
  max?: number
  /**
   * 进度弧的色调
   * @default "primary"
   */
  tone?: DataTone
  /**
   * 外径（像素）
   * @default 72
   */
  size?: number
  /**
   * 环的粗细，占外径的百分比
   * @default 10
   */
  thickness?: number
  /**
   * 圆弧的总角度：360 是整圆，270 是下方留口的仪表
   * @default 360
   */
  arc?: number
  /** 环中央的内容，默认是取整后的百分比 */
  children?: React.ReactNode
  /** 读屏名称 */
  label?: string
}

/**
 * 进度环：纯 SVG，比用图表库画一圈更轻也更清晰。
 * 进度弧从起点按弧线长度展开，系统开启「减少动态效果」时直接到位。
 */
function MiniRing({
  className,
  value,
  max = 100,
  tone = "primary",
  size = 72,
  thickness = 10,
  arc = 360,
  children,
  label,
  style,
  ...props
}: MiniRingProps) {
  const reduced = useReducedMotion()
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0
  const sweep = Math.min(360, Math.max(30, arc)) / 360
  // 圆从 3 点钟方向顺时针画：整圆从 12 点开始，开口仪表让缺口落在正下方
  const rotation = sweep === 1 ? -90 : 90 + (360 * (1 - sweep)) / 2
  const radius = 50 - thickness / 2
  const common = {
    cx: 50,
    cy: 50,
    r: radius,
    fill: "none",
    strokeWidth: thickness,
    strokeLinecap: "round",
    transform: `rotate(${rotation} 50 50)`,
    pathLength: 1,
  } as const
  return (
    <div
      data-slot="mini-ring"
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn(
        "relative flex shrink-0 items-center justify-center",
        className,
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="absolute inset-0 size-full"
      >
        <circle
          {...common}
          stroke="var(--edge)"
          strokeDasharray={`${sweep} 1`}
        />
        <motion.circle
          {...common}
          stroke={toneColor(tone)}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: ratio * sweep }}
          transition={{ duration: reduced ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div
        data-slot="mini-ring-content"
        className="relative flex flex-col items-center text-center leading-tight tabular-nums"
      >
        {children ?? (
          <span className="text-sm font-semibold">
            {formatStat(ratio * 100, { style: "percent", digits: 0 })}
          </span>
        )}
      </div>
    </div>
  )
}

export { MiniRing }
export type { MiniRingProps }
