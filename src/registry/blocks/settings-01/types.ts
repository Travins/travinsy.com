type ThemeMode = "light" | "dark" | "system"
type Density = "compact" | "comfortable" | "spacious"
type SoundTheme = "soft" | "crisp" | "mechanical"
type IndentWidth = "2" | "4" | "tab"
type ProfileVisibility = "public" | "team" | "private"

/** 设置页的全部取值。键按分区归类，见 config.ts 的 SECTION_KEYS。 */
type Settings01Values = {
  // 外观
  theme: ThemeMode
  /** 强调色，取值是 tone-picker 的色调名（primary、blue……）或任意 CSS 颜色 */
  accent: string
  /** 界面字号（px） */
  fontSize: number
  /** 圆角（px） */
  radius: number
  density: Density
  reduceMotion: boolean
  // 通知
  notifications: boolean
  notifyMentions: boolean
  notifyReplies: boolean
  notifyEmail: boolean
  notifyUpdates: boolean
  /** 免打扰时段 [起点, 终点]，单位小时，范围 12–36（36 即次日 12:00），读数按 24 小时取模 */
  quietHours: [number, number]
  // 声音与触感
  volume: number
  keySound: boolean
  soundTheme: SoundTheme
  haptics: boolean
  // 编辑器
  indent: IndentWidth
  lineHeight: number
  showTabs: boolean
  // 隐私
  visibility: ProfileVisibility
  analytics: boolean
  crashReports: boolean
  /** 历史记录保留天数 */
  retention: number
}

type Settings01SectionId =
  | "appearance"
  | "notifications"
  | "sound"
  | "editor"
  | "privacy"

export type {
  Density,
  IndentWidth,
  ProfileVisibility,
  Settings01SectionId,
  Settings01Values,
  SoundTheme,
  ThemeMode,
}
