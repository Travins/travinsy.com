/**
 * 颜色主题元数据（唯一来源）。
 * 对应 src/styles/themes.css 里的 `[data-theme="<id>"]`。
 * 亮暗模式是另一个独立维度，由 next-themes 通过 `.dark` class 控制。
 */

export type ColorTheme = {
  id: string
  /** 中文名 */
  name: string
  /** 预览色（亮 / 暗模式下的 primary），仅用于色块展示 */
  preview: { light: string; dark: string }
}

export const COLOR_THEMES = [
  {
    id: "neutral",
    name: "中性",
    preview: { light: "oklch(0.205 0 0)", dark: "oklch(0.922 0 0)" },
  },
  {
    id: "zinc",
    name: "锌灰",
    preview: { light: "oklch(0.21 0.006 285.885)", dark: "oklch(0.92 0.004 286.32)" },
  },
  {
    id: "stone",
    name: "石灰",
    preview: { light: "oklch(0.216 0.006 56.043)", dark: "oklch(0.923 0.003 48.717)" },
  },
  {
    id: "slate",
    name: "岩青",
    preview: { light: "oklch(0.208 0.042 265.755)", dark: "oklch(0.929 0.013 255.508)" },
  },
  {
    id: "rose",
    name: "玫瑰",
    preview: { light: "oklch(0.586 0.253 17.585)", dark: "oklch(0.514 0.222 16.935)" },
  },
  {
    id: "orange",
    name: "橙色",
    preview: { light: "oklch(0.646 0.222 41.116)", dark: "oklch(0.553 0.195 38.402)" },
  },
  {
    id: "amber",
    name: "琥珀",
    preview: { light: "oklch(0.769 0.188 70.08)", dark: "oklch(0.666 0.179 58.318)" },
  },
  {
    id: "green",
    name: "翠绿",
    preview: { light: "oklch(0.627 0.194 149.214)", dark: "oklch(0.527 0.154 150.069)" },
  },
  {
    id: "blue",
    name: "海蓝",
    preview: { light: "oklch(0.546 0.245 262.881)", dark: "oklch(0.488 0.243 264.376)" },
  },
  {
    id: "violet",
    name: "紫罗兰",
    preview: { light: "oklch(0.541 0.281 293.009)", dark: "oklch(0.491 0.27 292.581)" },
  },
] as const satisfies readonly ColorTheme[]

export type ColorThemeId = (typeof COLOR_THEMES)[number]["id"]

export const DEFAULT_COLOR_THEME: ColorThemeId = "neutral"

/** 颜色主题在 localStorage 里的 key（亮暗模式由 next-themes 用 "theme" 管理） */
export const COLOR_THEME_STORAGE_KEY = "color-theme"

export function isColorTheme(value: unknown): value is ColorThemeId {
  return COLOR_THEMES.some((theme) => theme.id === value)
}

/**
 * 首帧之前同步执行的内联脚本：从 localStorage 读取颜色主题并写到 <html data-theme>，
 * 避免静态导出下（无法用 cookie）出现主题闪烁。
 */
export const COLOR_THEME_INIT_SCRIPT = `(function(){try{var ids=${JSON.stringify(
  COLOR_THEMES.map((theme) => theme.id)
)};var t=localStorage.getItem(${JSON.stringify(COLOR_THEME_STORAGE_KEY)});if(ids.indexOf(t)<0)t=${JSON.stringify(
  DEFAULT_COLOR_THEME
)};document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme",${JSON.stringify(
  DEFAULT_COLOR_THEME
)})}})()`
