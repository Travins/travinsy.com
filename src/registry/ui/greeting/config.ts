import type { GreetingPeriod } from "./period"

/** 问候卡片与时段指示的可见文案；`labels` 按字段整体覆盖（`names` 等对象不做深合并）。 */
type GreetingLabels = {
  /** 卡片顶部的小标题 */
  eyebrow: string
  /** 挂载前小标题后的占位 */
  pending: string
  /** 时段指示的读屏名称 */
  periods: string
  /** 各时段的短名称 */
  names: Record<GreetingPeriod, string>
  /** 各时段的英文标记，显示在小标题后 */
  tags: Record<GreetingPeriod, string>
  /** 各时段轮换的副标题，至少一条 */
  messages: Record<GreetingPeriod, readonly string[]>
  /** 挂载前的副标题 */
  fallbackMessage: string
}

const DEFAULT_LABELS: GreetingLabels = {
  eyebrow: "GREETING",
  pending: "LOCAL TIME",
  periods: "一天中的时段",
  names: { morning: "早上", noon: "中午", afternoon: "下午", evening: "晚上" },
  tags: {
    morning: "MORNING",
    noon: "NOON",
    afternoon: "AFTERNOON",
    evening: "EVENING",
  },
  messages: {
    morning: ["新的一天，先从最重要的一件事开始。", "今天想先做点什么？"],
    noon: ["记得吃饭，也给眼睛放个假。", "上午辛苦了，下午继续。"],
    afternoon: ["喝杯水，起来走动一下。", "下午的专注力很宝贵。"],
    evening: ["今天辛苦了，慢慢来。", "收个尾，早点休息。"],
  },
  fallbackMessage: "很高兴在这里遇见你。",
}

export { DEFAULT_LABELS }
export type { GreetingLabels }
