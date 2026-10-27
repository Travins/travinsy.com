"use client"

import { useReducedMotion } from "motion/react"

/** 坐标轴刻度：11px、次要文字色。 */
const CHART_AXIS_TICK = {
  fontSize: 11,
  fill: "var(--muted-foreground)",
} as const

/** 网格线：只画水平线，细、淡、虚线，颜色取线条网格的 `--edge`。 */
const CHART_GRID = {
  vertical: false,
  stroke: "var(--edge)",
  strokeDasharray: "3 4",
} as const

/** recharts 的入场动画开关：系统开启「减少动态效果」时关闭。 */
function useChartAnimation() {
  const reduced = useReducedMotion()
  return { isAnimationActive: !reduced, animationDuration: 700 } as const
}

export { CHART_AXIS_TICK, CHART_GRID, useChartAnimation }
