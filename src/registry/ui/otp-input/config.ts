/** 用户可见文案。`{index}` 会被替换成第几位（从 1 数）。 */
const DEFAULT_LABELS = {
  /** 第 2 位起每一格的读屏名称；第一格用组件的 label / aria-label */
  slot: "第 {index} 位",
}

type OtpInputLabels = typeof DEFAULT_LABELS

export { DEFAULT_LABELS }
export type { OtpInputLabels }
