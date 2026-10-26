/** 时钟类组件的可见文案；各组件通过 `labels` 部分覆盖。 */
type LocalTimeLabels = {
  /** 挂载前，占位时间之后的说明 */
  pending: string
  /** 与访客同一时间 */
  same: string
  /** 目标时区更靠前时的前缀 */
  ahead: string
  /** 目标时区更靠后时的前缀 */
  behind: string
  /** 时差的单位 */
  hourUnit: string
  /** 白天标记的读屏文字 */
  day: string
  /** 夜间标记的读屏文字 */
  night: string
  /** 目标时区日期比访客早一天 */
  yesterday: string
  /** 与访客同一天 */
  today: string
  /** 目标时区日期比访客晚一天 */
  tomorrow: string
  /** 世界时钟的默认标题 */
  worldClock: string
  /** 世界时钟标题旁的“实时”标记 */
  live: string
  /** 模拟表盘的默认读屏名称 */
  clock: string
}

const DEFAULT_LABELS: LocalTimeLabels = {
  pending: "当地时间",
  same: "与你同一时间",
  ahead: "早",
  behind: "晚",
  hourUnit: "小时",
  day: "白天",
  night: "夜间",
  yesterday: "昨天",
  today: "今天",
  tomorrow: "明天",
  worldClock: "WORLD CLOCK",
  live: "LIVE",
  clock: "当地时间",
}

export { DEFAULT_LABELS }
export type { LocalTimeLabels }
