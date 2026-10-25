/**
 * 个人封面的界面文案。
 * 姓名、简介、职业标签属于页面数据，通过 ProfileHero 的 props 传入，不放在这里。
 */
const DEFAULT_LABELS = {
  pauseRoles: "暂停职业标签",
  playRoles: "播放职业标签",
} as const

type ProfileHeroLabels = { [Key in keyof typeof DEFAULT_LABELS]: string }

/** 合并用户传入的文案与默认文案。 */
function resolveLabels(labels?: Partial<ProfileHeroLabels>): ProfileHeroLabels {
  return { ...DEFAULT_LABELS, ...labels }
}

export { DEFAULT_LABELS, resolveLabels }
export type { ProfileHeroLabels }
