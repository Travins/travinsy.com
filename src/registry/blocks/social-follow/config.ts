/**
 * 社交关注区块的界面文案。
 * 链接名称、说明文字属于页面数据，通过 SocialFollow 的 props 传入，不放在这里。
 */
const DEFAULT_LABELS = {
  socialLinks: "社交链接",
} as const

type SocialFollowLabels = { [Key in keyof typeof DEFAULT_LABELS]: string }

/** 合并用户传入的文案与默认文案。 */
function resolveLabels(labels?: Partial<SocialFollowLabels>): SocialFollowLabels {
  return { ...DEFAULT_LABELS, ...labels }
}

export { DEFAULT_LABELS, resolveLabels }
export type { SocialFollowLabels }
