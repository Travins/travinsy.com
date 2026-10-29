/** 用户可见文案。`{min}` / `{max}` 会替换成带货币符号的千分位金额。 */
const DEFAULT_LABELS = {
  /** 人民币大写读数前的名称，也是读屏播报的前缀 */
  uppercase: "大写",
  /** 还没有输入金额时，大写行显示的提示 */
  uppercasePlaceholder: "填写金额后自动生成大写",
  /** 大数估读前缀：约 1.2亿 */
  approximate: "约",
  belowMin: "金额不能低于 {min}",
  aboveMax: "金额不能超过 {max}",
}

type AmountInputLabels = typeof DEFAULT_LABELS

export { DEFAULT_LABELS }
export type { AmountInputLabels }
