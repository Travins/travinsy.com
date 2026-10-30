const DEFAULT_LABELS = {
  /** 支持 {current} 和 {total} 占位符 */
  compactText: "第 {current} 步 / 共 {total} 步",
  list: "流程步骤",
  srWait: "未开始",
  srProcess: "进行中",
  srFinish: "已完成",
  srError: "出错",
  srDisabled: "不可返回",
}

type StepsLabels = typeof DEFAULT_LABELS

export { DEFAULT_LABELS }
export type { StepsLabels }
