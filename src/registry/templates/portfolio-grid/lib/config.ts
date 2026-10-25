/**
 * 个人主页里固定的界面文案。
 * 姓名、简介、区块标题、技术栈列表等个人信息都在 site.config.ts 里。
 */
const DEFAULT_LABELS = {
  siteNav: "页面导航",
  stackEyebrow: "TOOLS OF THE TRADE",
  aboutFootnote: "持续学习，慢慢构建。",
} as const

type PortfolioGridLabels = { [Key in keyof typeof DEFAULT_LABELS]: string }

/** 合并用户传入的文案与默认文案。 */
function resolveLabels(
  labels?: Partial<PortfolioGridLabels>,
): PortfolioGridLabels {
  return { ...DEFAULT_LABELS, ...labels }
}

export { DEFAULT_LABELS, resolveLabels }
export type { PortfolioGridLabels }
