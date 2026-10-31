import type { Settings01SectionId, Settings01Values } from "./types"

/**
 * 设置页所有用户可见的文案。
 * 含 {count}、{value}、{section} 的文案在渲染时由 formatLabel 填入实际值。
 */
const DEFAULT_LABELS = {
  // 页面
  title: "设置",
  description: "调整外观、通知、声音与编辑器的偏好",
  navLabel: "设置分区",
  navSectionModified: "已修改 {count} 项",
  // 分区名（导航与面板）
  sectionAppearance: "外观",
  sectionNotifications: "通知",
  sectionSound: "声音与触感",
  sectionEditor: "编辑器",
  sectionPrivacy: "隐私",
  // 窄屏顶部分段选择里的短名，宽度有限所以单独一份
  navAppearance: "外观",
  navNotifications: "通知",
  navSound: "声音",
  navEditor: "编辑器",
  navPrivacy: "隐私",
  // 分区说明
  descriptionAppearance: "主题、强调色与界面尺寸，右侧预览会实时变化",
  descriptionNotifications: "决定哪些事件会打扰你，以及什么时候不打扰",
  descriptionSound: "音量、按键音效与触感反馈",
  descriptionEditor: "缩进、行高与空白字符的显示方式",
  descriptionPrivacy: "谁能看到你，以及我们收集哪些数据",
  // 面板头部
  panelModified: "已修改 {count} 项",
  panelDefault: "全部为默认值",
  copySection: "复制本分区设置",
  copiedSection: "已复制",
  resetSection: "恢复本分区默认值",
  // 外观
  groupTheme: "主题",
  groupShape: "尺寸与形状",
  groupMotion: "动态",
  theme: "主题模式",
  themeLight: "浅色",
  themeDark: "深色",
  themeSystem: "跟随系统",
  accent: "强调色",
  fontSize: "界面字号",
  radius: "圆角",
  density: "信息密度",
  densityCompact: "紧凑",
  densityComfortable: "舒适",
  densitySpacious: "宽松",
  reduceMotion: "减少动态效果",
  reduceMotionHint: "关闭动画",
  readoutPx: "{value}px",
  // 预览卡片
  previewTitle: "实时预览",
  previewHeading: "本周回顾",
  previewBody: "已完成 12 项任务，比上周多 3 项。",
  previewAction: "查看详情",
  previewProgress: "进度",
  previewLive: "实时",
  previewModeLight: "浅色",
  previewModeDark: "深色",
  previewModeSystem: "跟随系统",
  // 通知
  groupChannels: "通知渠道",
  groupQuiet: "免打扰",
  notifications: "允许通知",
  notificationsHint: "总开关",
  notifyMentions: "提及我",
  notifyMentionsHint: "有人 @ 我时",
  notifyReplies: "评论回复",
  notifyRepliesHint: "有人回复时",
  notifyEmail: "邮件摘要",
  notifyEmailHint: "每天一封",
  notifyUpdates: "产品动态",
  notifyUpdatesHint: "新功能上线",
  quietHours: "免打扰时段",
  // 声音与触感
  groupVolume: "音量",
  groupFeedback: "反馈",
  volume: "主音量",
  keySound: "按键音效",
  keySoundHint: "输入时发声",
  soundTheme: "音色",
  soundSoft: "柔和",
  soundCrisp: "清脆",
  soundMechanical: "机械",
  haptics: "触感反馈",
  hapticsHint: "设备震动",
  // 编辑器
  groupIndent: "缩进与行距",
  groupWhitespace: "空白字符",
  indent: "缩进宽度",
  indentTwo: "2 空格",
  indentFour: "4 空格",
  indentTab: "制表符",
  lineHeight: "行高",
  showTabs: "显示制表符",
  showTabsHint: "标出缩进",
  editorPreviewTitle: "代码预览",
  // 隐私
  groupProfile: "个人资料",
  groupData: "数据",
  visibility: "资料可见范围",
  visibilityPublic: "公开",
  visibilityTeam: "团队",
  visibilityPrivate: "仅自己",
  analytics: "使用统计",
  analyticsHint: "匿名数据",
  crashReports: "崩溃报告",
  crashReportsHint: "自动上报",
  retention: "历史保留",
  readoutDays: "{value} 天",
  changesTitle: "改动对比",
  undoChange: "撤销 {field} 的修改",
  resetChanges: "全部恢复",
  valueOn: "开",
  valueOff: "关",
  // 底部操作栏
  footerLabel: "保存设置",
  modifiedCount: "已修改 {count} 项",
  unmodified: "全部为默认值",
  unsaved: "有未保存的更改",
  upToDate: "没有未保存的更改",
  saving: "保存中…",
  saved: "已保存",
  save: "保存",
  resetAll: "恢复默认",
  saveFailed: "保存失败，请稍后重试",
} as const

type Settings01Labels = { [Key in keyof typeof DEFAULT_LABELS]: string }

/** 出厂默认值。组件的「已修改」判断、恢复默认和未受控时的初始值都以它为准。 */
const DEFAULT_VALUES: Settings01Values = {
  theme: "system",
  accent: "primary",
  fontSize: 14,
  radius: 10,
  density: "comfortable",
  reduceMotion: false,
  notifications: true,
  notifyMentions: true,
  notifyReplies: true,
  notifyEmail: false,
  notifyUpdates: false,
  quietHours: [22, 31],
  volume: 60,
  keySound: false,
  soundTheme: "soft",
  haptics: true,
  indent: "2",
  lineHeight: 1.6,
  showTabs: false,
  visibility: "team",
  analytics: true,
  crashReports: true,
  retention: 90,
}

/** 分区的显示顺序 */
const SECTION_IDS: readonly Settings01SectionId[] = [
  "appearance",
  "notifications",
  "sound",
  "editor",
  "privacy",
]

/** 每个分区管哪些设置项：分区计数、分区复制与分区恢复默认都按它来。 */
const SECTION_KEYS: Record<Settings01SectionId, readonly (keyof Settings01Values)[]> =
  {
    appearance: [
      "theme",
      "accent",
      "fontSize",
      "radius",
      "density",
      "reduceMotion",
    ],
    notifications: [
      "notifications",
      "notifyMentions",
      "notifyReplies",
      "notifyEmail",
      "notifyUpdates",
      "quietHours",
    ],
    sound: ["volume", "keySound", "soundTheme", "haptics"],
    editor: ["indent", "lineHeight", "showTabs"],
    privacy: ["visibility", "analytics", "crashReports", "retention"],
  }

/** 每个分区用到的文案键：完整名称、说明与窄屏短名。 */
const SECTION_LABEL_KEYS: Record<
  Settings01SectionId,
  {
    title: keyof Settings01Labels
    description: keyof Settings01Labels
    nav: keyof Settings01Labels
  }
> = {
  appearance: {
    title: "sectionAppearance",
    description: "descriptionAppearance",
    nav: "navAppearance",
  },
  notifications: {
    title: "sectionNotifications",
    description: "descriptionNotifications",
    nav: "navNotifications",
  },
  sound: {
    title: "sectionSound",
    description: "descriptionSound",
    nav: "navSound",
  },
  editor: {
    title: "sectionEditor",
    description: "descriptionEditor",
    nav: "navEditor",
  },
  privacy: {
    title: "sectionPrivacy",
    description: "descriptionPrivacy",
    nav: "navPrivacy",
  },
}

/** 合并用户传入的文案与默认文案。 */
function resolveLabels(labels?: Partial<Settings01Labels>): Settings01Labels {
  return { ...DEFAULT_LABELS, ...labels }
}

/** 把文案里的 {key} 占位符替换成实际值，例如「已修改 {count} 项」。 */
function formatLabel(
  template: string,
  values: Record<string, string | number>,
): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  )
}

export {
  DEFAULT_LABELS,
  DEFAULT_VALUES,
  SECTION_IDS,
  SECTION_KEYS,
  SECTION_LABEL_KEYS,
  formatLabel,
  resolveLabels,
}
export type { Settings01Labels }
