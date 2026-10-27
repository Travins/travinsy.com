import {
  Minus,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"

import type { DataTone } from "@/registry/lib/data-display"

/** 达标 / 关注 / 风险 / 审核中，四种状态与它们的色调、图标。 */
type StatStatusName = "ok" | "watch" | "risk" | "review"

const STATUS_TONES: Record<StatStatusName, DataTone> = {
  ok: "green",
  watch: "amber",
  risk: "rose",
  review: "blue",
}

const STATUS_ICONS: Record<StatStatusName, LucideIcon> = {
  ok: TrendingUp,
  watch: Minus,
  risk: TrendingDown,
  review: ShieldAlert,
}

type StatLabels = {
  ok: string
  watch: string
  risk: string
  review: string
  /** 涨跌方向的读屏文字 */
  up: string
  down: string
  flat: string
  /** 进度条、计量条的读屏名称 */
  progress: string
  meter: string
  /** 分布条的读屏名称 */
  distribution: string
  /** 延迟分区表的表头 */
  zone: string
  rangeShare: string
}

const DEFAULT_LABELS: StatLabels = {
  ok: "达标",
  watch: "关注",
  risk: "风险",
  review: "审核中",
  up: "上升",
  down: "下降",
  flat: "持平",
  progress: "进度",
  meter: "计量",
  distribution: "占比分布",
  zone: "分区",
  rangeShare: "范围 / 占比",
}

/** 「用量」口径：越高越危险。默认 65% 起关注，90% 起风险。 */
function usageStatus(
  percent: number,
  thresholds: { watch?: number; risk?: number } = {},
): StatStatusName {
  const { watch = 65, risk = 90 } = thresholds
  return percent >= risk ? "risk" : percent >= watch ? "watch" : "ok"
}

/** 「健康度」口径：越高越好。低于 40% 风险，低于 75% 关注。 */
function healthStatus(
  percent: number,
  thresholds: { risk?: number; watch?: number } = {},
): StatStatusName {
  const { risk = 40, watch = 75 } = thresholds
  return percent < risk ? "risk" : percent < watch ? "watch" : "ok"
}

export { DEFAULT_LABELS, STATUS_ICONS, STATUS_TONES, healthStatus, usageStatus }
export type { StatLabels, StatStatusName }
