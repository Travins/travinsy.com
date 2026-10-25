/**
 * 颜色主题（唯一来源）。
 *
 * 这里同时包含元数据和每个主题亮 / 暗两组完整的 CSS 变量。以下产物都由它生成：
 * - src/styles/themes.css                 （`pnpm themes:build`）
 * - public/r/theme-<id>.json、themes.json （shadcn registry:theme 条目与目录）
 * - /themes 页面的预览与「复制代码」
 *
 * 色值来源：shadcn 官方（github.com/shadcn-ui/ui → apps/v4/registry/themes.ts；
 * slate 取自 ui.shadcn.com/r/colors/slate.json 的 cssVarsV4）。
 * 官方的彩色主题只给出覆盖项，叠加在 zinc 基底之上，这里同样合并成完整变量集。
 * 不包含 --radius，圆角由使用者自己的 globals.css 决定。
 *
 * 亮暗模式是另一个独立维度，由 next-themes 通过 `.dark` class 控制。
 * 注意：此文件会被 scripts/build-theme-registry.ts 直接运行，不要使用 `@/` 别名导入。
 */

export type ThemeVars = Record<string, string>

export type ThemeVarSets = { light: ThemeVars; dark: ThemeVars }

export type ColorTheme = {
  id: string
  /** 中文名 */
  name: string
  /** 英文名（registry 条目标题） */
  title: string
  description: string
  /** 预览色（亮 / 暗模式下的 primary），仅用于色块展示，由 cssVars 派生 */
  preview: { light: string; dark: string }
  /** 完整变量集，键名不带 `--` 前缀，与 globals.css 一致 */
  cssVars: ThemeVarSets
}

/** 基底与官方完整主题。 */
const NEUTRAL: ThemeVarSets = {
  light: {
    background: "oklch(1 0 0)",
    foreground: "oklch(0.145 0 0)",
    card: "oklch(1 0 0)",
    "card-foreground": "oklch(0.145 0 0)",
    popover: "oklch(1 0 0)",
    "popover-foreground": "oklch(0.145 0 0)",
    primary: "oklch(0.205 0 0)",
    "primary-foreground": "oklch(0.985 0 0)",
    secondary: "oklch(0.97 0 0)",
    "secondary-foreground": "oklch(0.205 0 0)",
    muted: "oklch(0.97 0 0)",
    "muted-foreground": "oklch(0.556 0 0)",
    accent: "oklch(0.97 0 0)",
    "accent-foreground": "oklch(0.205 0 0)",
    destructive: "oklch(0.577 0.245 27.325)",
    border: "oklch(0.922 0 0)",
    input: "oklch(0.922 0 0)",
    ring: "oklch(0.708 0 0)",
    "chart-1": "oklch(0.87 0 0)",
    "chart-2": "oklch(0.556 0 0)",
    "chart-3": "oklch(0.439 0 0)",
    "chart-4": "oklch(0.371 0 0)",
    "chart-5": "oklch(0.269 0 0)",
    sidebar: "oklch(0.985 0 0)",
    "sidebar-foreground": "oklch(0.145 0 0)",
    "sidebar-primary": "oklch(0.205 0 0)",
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
    "sidebar-accent": "oklch(0.97 0 0)",
    "sidebar-accent-foreground": "oklch(0.205 0 0)",
    "sidebar-border": "oklch(0.922 0 0)",
    "sidebar-ring": "oklch(0.708 0 0)",
  },
  dark: {
    background: "oklch(0.145 0 0)",
    foreground: "oklch(0.985 0 0)",
    card: "oklch(0.205 0 0)",
    "card-foreground": "oklch(0.985 0 0)",
    popover: "oklch(0.205 0 0)",
    "popover-foreground": "oklch(0.985 0 0)",
    primary: "oklch(0.922 0 0)",
    "primary-foreground": "oklch(0.205 0 0)",
    secondary: "oklch(0.269 0 0)",
    "secondary-foreground": "oklch(0.985 0 0)",
    muted: "oklch(0.269 0 0)",
    "muted-foreground": "oklch(0.708 0 0)",
    accent: "oklch(0.269 0 0)",
    "accent-foreground": "oklch(0.985 0 0)",
    destructive: "oklch(0.704 0.191 22.216)",
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    ring: "oklch(0.556 0 0)",
    "chart-1": "oklch(0.87 0 0)",
    "chart-2": "oklch(0.556 0 0)",
    "chart-3": "oklch(0.439 0 0)",
    "chart-4": "oklch(0.371 0 0)",
    "chart-5": "oklch(0.269 0 0)",
    sidebar: "oklch(0.205 0 0)",
    "sidebar-foreground": "oklch(0.985 0 0)",
    "sidebar-primary": "oklch(0.488 0.243 264.376)",
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
    "sidebar-accent": "oklch(0.269 0 0)",
    "sidebar-accent-foreground": "oklch(0.985 0 0)",
    "sidebar-border": "oklch(1 0 0 / 10%)",
    "sidebar-ring": "oklch(0.556 0 0)",
  },
}

const ZINC: ThemeVarSets = {
  light: {
    background: "oklch(1 0 0)",
    foreground: "oklch(0.141 0.005 285.823)",
    card: "oklch(1 0 0)",
    "card-foreground": "oklch(0.141 0.005 285.823)",
    popover: "oklch(1 0 0)",
    "popover-foreground": "oklch(0.141 0.005 285.823)",
    primary: "oklch(0.21 0.006 285.885)",
    "primary-foreground": "oklch(0.985 0 0)",
    secondary: "oklch(0.967 0.001 286.375)",
    "secondary-foreground": "oklch(0.21 0.006 285.885)",
    muted: "oklch(0.967 0.001 286.375)",
    "muted-foreground": "oklch(0.552 0.016 285.938)",
    accent: "oklch(0.967 0.001 286.375)",
    "accent-foreground": "oklch(0.21 0.006 285.885)",
    destructive: "oklch(0.577 0.245 27.325)",
    border: "oklch(0.92 0.004 286.32)",
    input: "oklch(0.92 0.004 286.32)",
    ring: "oklch(0.705 0.015 286.067)",
    "chart-1": "oklch(0.871 0.006 286.286)",
    "chart-2": "oklch(0.552 0.016 285.938)",
    "chart-3": "oklch(0.442 0.017 285.786)",
    "chart-4": "oklch(0.37 0.013 285.805)",
    "chart-5": "oklch(0.274 0.006 286.033)",
    sidebar: "oklch(0.985 0 0)",
    "sidebar-foreground": "oklch(0.141 0.005 285.823)",
    "sidebar-primary": "oklch(0.21 0.006 285.885)",
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
    "sidebar-accent": "oklch(0.967 0.001 286.375)",
    "sidebar-accent-foreground": "oklch(0.21 0.006 285.885)",
    "sidebar-border": "oklch(0.92 0.004 286.32)",
    "sidebar-ring": "oklch(0.705 0.015 286.067)",
  },
  dark: {
    background: "oklch(0.141 0.005 285.823)",
    foreground: "oklch(0.985 0 0)",
    card: "oklch(0.21 0.006 285.885)",
    "card-foreground": "oklch(0.985 0 0)",
    popover: "oklch(0.21 0.006 285.885)",
    "popover-foreground": "oklch(0.985 0 0)",
    primary: "oklch(0.92 0.004 286.32)",
    "primary-foreground": "oklch(0.21 0.006 285.885)",
    secondary: "oklch(0.274 0.006 286.033)",
    "secondary-foreground": "oklch(0.985 0 0)",
    muted: "oklch(0.274 0.006 286.033)",
    "muted-foreground": "oklch(0.705 0.015 286.067)",
    accent: "oklch(0.274 0.006 286.033)",
    "accent-foreground": "oklch(0.985 0 0)",
    destructive: "oklch(0.704 0.191 22.216)",
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    ring: "oklch(0.552 0.016 285.938)",
    "chart-1": "oklch(0.871 0.006 286.286)",
    "chart-2": "oklch(0.552 0.016 285.938)",
    "chart-3": "oklch(0.442 0.017 285.786)",
    "chart-4": "oklch(0.37 0.013 285.805)",
    "chart-5": "oklch(0.274 0.006 286.033)",
    sidebar: "oklch(0.21 0.006 285.885)",
    "sidebar-foreground": "oklch(0.985 0 0)",
    "sidebar-primary": "oklch(0.488 0.243 264.376)",
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
    "sidebar-accent": "oklch(0.274 0.006 286.033)",
    "sidebar-accent-foreground": "oklch(0.985 0 0)",
    "sidebar-border": "oklch(1 0 0 / 10%)",
    "sidebar-ring": "oklch(0.552 0.016 285.938)",
  },
}

const STONE: ThemeVarSets = {
  light: {
    background: "oklch(1 0 0)",
    foreground: "oklch(0.147 0.004 49.25)",
    card: "oklch(1 0 0)",
    "card-foreground": "oklch(0.147 0.004 49.25)",
    popover: "oklch(1 0 0)",
    "popover-foreground": "oklch(0.147 0.004 49.25)",
    primary: "oklch(0.216 0.006 56.043)",
    "primary-foreground": "oklch(0.985 0.001 106.423)",
    secondary: "oklch(0.97 0.001 106.424)",
    "secondary-foreground": "oklch(0.216 0.006 56.043)",
    muted: "oklch(0.97 0.001 106.424)",
    "muted-foreground": "oklch(0.553 0.013 58.071)",
    accent: "oklch(0.97 0.001 106.424)",
    "accent-foreground": "oklch(0.216 0.006 56.043)",
    destructive: "oklch(0.577 0.245 27.325)",
    border: "oklch(0.923 0.003 48.717)",
    input: "oklch(0.923 0.003 48.717)",
    ring: "oklch(0.709 0.01 56.259)",
    "chart-1": "oklch(0.869 0.005 56.366)",
    "chart-2": "oklch(0.553 0.013 58.071)",
    "chart-3": "oklch(0.444 0.011 73.639)",
    "chart-4": "oklch(0.374 0.01 67.558)",
    "chart-5": "oklch(0.268 0.007 34.298)",
    sidebar: "oklch(0.985 0.001 106.423)",
    "sidebar-foreground": "oklch(0.147 0.004 49.25)",
    "sidebar-primary": "oklch(0.216 0.006 56.043)",
    "sidebar-primary-foreground": "oklch(0.985 0.001 106.423)",
    "sidebar-accent": "oklch(0.97 0.001 106.424)",
    "sidebar-accent-foreground": "oklch(0.216 0.006 56.043)",
    "sidebar-border": "oklch(0.923 0.003 48.717)",
    "sidebar-ring": "oklch(0.709 0.01 56.259)",
  },
  dark: {
    background: "oklch(0.147 0.004 49.25)",
    foreground: "oklch(0.985 0.001 106.423)",
    card: "oklch(0.216 0.006 56.043)",
    "card-foreground": "oklch(0.985 0.001 106.423)",
    popover: "oklch(0.216 0.006 56.043)",
    "popover-foreground": "oklch(0.985 0.001 106.423)",
    primary: "oklch(0.923 0.003 48.717)",
    "primary-foreground": "oklch(0.216 0.006 56.043)",
    secondary: "oklch(0.268 0.007 34.298)",
    "secondary-foreground": "oklch(0.985 0.001 106.423)",
    muted: "oklch(0.268 0.007 34.298)",
    "muted-foreground": "oklch(0.709 0.01 56.259)",
    accent: "oklch(0.268 0.007 34.298)",
    "accent-foreground": "oklch(0.985 0.001 106.423)",
    destructive: "oklch(0.704 0.191 22.216)",
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    ring: "oklch(0.553 0.013 58.071)",
    "chart-1": "oklch(0.869 0.005 56.366)",
    "chart-2": "oklch(0.553 0.013 58.071)",
    "chart-3": "oklch(0.444 0.011 73.639)",
    "chart-4": "oklch(0.374 0.01 67.558)",
    "chart-5": "oklch(0.268 0.007 34.298)",
    sidebar: "oklch(0.216 0.006 56.043)",
    "sidebar-foreground": "oklch(0.985 0.001 106.423)",
    "sidebar-primary": "oklch(0.488 0.243 264.376)",
    "sidebar-primary-foreground": "oklch(0.985 0.001 106.423)",
    "sidebar-accent": "oklch(0.268 0.007 34.298)",
    "sidebar-accent-foreground": "oklch(0.985 0.001 106.423)",
    "sidebar-border": "oklch(1 0 0 / 10%)",
    "sidebar-ring": "oklch(0.553 0.013 58.071)",
  },
}

const SLATE: ThemeVarSets = {
  light: {
    background: "oklch(1 0 0)",
    foreground: "oklch(0.129 0.042 264.695)",
    card: "oklch(1 0 0)",
    "card-foreground": "oklch(0.129 0.042 264.695)",
    popover: "oklch(1 0 0)",
    "popover-foreground": "oklch(0.129 0.042 264.695)",
    primary: "oklch(0.208 0.042 265.755)",
    "primary-foreground": "oklch(0.984 0.003 247.858)",
    secondary: "oklch(0.968 0.007 247.896)",
    "secondary-foreground": "oklch(0.208 0.042 265.755)",
    muted: "oklch(0.968 0.007 247.896)",
    "muted-foreground": "oklch(0.554 0.046 257.417)",
    accent: "oklch(0.968 0.007 247.896)",
    "accent-foreground": "oklch(0.208 0.042 265.755)",
    destructive: "oklch(0.577 0.245 27.325)",
    border: "oklch(0.929 0.013 255.508)",
    input: "oklch(0.929 0.013 255.508)",
    ring: "oklch(0.704 0.04 256.788)",
    "chart-1": "oklch(0.646 0.222 41.116)",
    "chart-2": "oklch(0.6 0.118 184.704)",
    "chart-3": "oklch(0.398 0.07 227.392)",
    "chart-4": "oklch(0.828 0.189 84.429)",
    "chart-5": "oklch(0.769 0.188 70.08)",
    sidebar: "oklch(0.984 0.003 247.858)",
    "sidebar-foreground": "oklch(0.129 0.042 264.695)",
    "sidebar-primary": "oklch(0.208 0.042 265.755)",
    "sidebar-primary-foreground": "oklch(0.984 0.003 247.858)",
    "sidebar-accent": "oklch(0.968 0.007 247.896)",
    "sidebar-accent-foreground": "oklch(0.208 0.042 265.755)",
    "sidebar-border": "oklch(0.929 0.013 255.508)",
    "sidebar-ring": "oklch(0.704 0.04 256.788)",
  },
  dark: {
    background: "oklch(0.129 0.042 264.695)",
    foreground: "oklch(0.984 0.003 247.858)",
    card: "oklch(0.208 0.042 265.755)",
    "card-foreground": "oklch(0.984 0.003 247.858)",
    popover: "oklch(0.208 0.042 265.755)",
    "popover-foreground": "oklch(0.984 0.003 247.858)",
    primary: "oklch(0.929 0.013 255.508)",
    "primary-foreground": "oklch(0.208 0.042 265.755)",
    secondary: "oklch(0.279 0.041 260.031)",
    "secondary-foreground": "oklch(0.984 0.003 247.858)",
    muted: "oklch(0.279 0.041 260.031)",
    "muted-foreground": "oklch(0.704 0.04 256.788)",
    accent: "oklch(0.279 0.041 260.031)",
    "accent-foreground": "oklch(0.984 0.003 247.858)",
    destructive: "oklch(0.704 0.191 22.216)",
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    ring: "oklch(0.551 0.027 264.364)",
    "chart-1": "oklch(0.488 0.243 264.376)",
    "chart-2": "oklch(0.696 0.17 162.48)",
    "chart-3": "oklch(0.769 0.188 70.08)",
    "chart-4": "oklch(0.627 0.265 303.9)",
    "chart-5": "oklch(0.645 0.246 16.439)",
    sidebar: "oklch(0.208 0.042 265.755)",
    "sidebar-foreground": "oklch(0.984 0.003 247.858)",
    "sidebar-primary": "oklch(0.488 0.243 264.376)",
    "sidebar-primary-foreground": "oklch(0.984 0.003 247.858)",
    "sidebar-accent": "oklch(0.279 0.041 260.031)",
    "sidebar-accent-foreground": "oklch(0.984 0.003 247.858)",
    "sidebar-border": "oklch(1 0 0 / 10%)",
    "sidebar-ring": "oklch(0.551 0.027 264.364)",
  },
}

/** 彩色主题：官方只给出覆盖项，叠加在 zinc 基底之上。 */
const ROSE: ThemeVarSets = {
  light: {
    primary: "oklch(0.514 0.222 16.935)",
    "primary-foreground": "oklch(0.969 0.015 12.422)",
    secondary: "oklch(0.967 0.001 286.375)",
    "secondary-foreground": "oklch(0.21 0.006 285.885)",
    "chart-1": "oklch(0.81 0.117 11.638)",
    "chart-2": "oklch(0.645 0.246 16.439)",
    "chart-3": "oklch(0.586 0.253 17.585)",
    "chart-4": "oklch(0.514 0.222 16.935)",
    "chart-5": "oklch(0.455 0.188 13.697)",
    "sidebar-primary": "oklch(0.586 0.253 17.585)",
    "sidebar-primary-foreground": "oklch(0.969 0.015 12.422)",
  },
  dark: {
    primary: "oklch(0.455 0.188 13.697)",
    "primary-foreground": "oklch(0.969 0.015 12.422)",
    secondary: "oklch(0.274 0.006 286.033)",
    "secondary-foreground": "oklch(0.985 0 0)",
    "chart-1": "oklch(0.81 0.117 11.638)",
    "chart-2": "oklch(0.645 0.246 16.439)",
    "chart-3": "oklch(0.586 0.253 17.585)",
    "chart-4": "oklch(0.514 0.222 16.935)",
    "chart-5": "oklch(0.455 0.188 13.697)",
    sidebar: "oklch(0.21 0.006 285.885)",
    "sidebar-primary": "oklch(0.645 0.246 16.439)",
    "sidebar-primary-foreground": "oklch(0.969 0.015 12.422)",
  },
}

const ORANGE: ThemeVarSets = {
  light: {
    primary: "oklch(0.553 0.195 38.402)",
    "primary-foreground": "oklch(0.98 0.016 73.684)",
    secondary: "oklch(0.967 0.001 286.375)",
    "secondary-foreground": "oklch(0.21 0.006 285.885)",
    "chart-1": "oklch(0.837 0.128 66.29)",
    "chart-2": "oklch(0.705 0.213 47.604)",
    "chart-3": "oklch(0.646 0.222 41.116)",
    "chart-4": "oklch(0.553 0.195 38.402)",
    "chart-5": "oklch(0.47 0.157 37.304)",
    "sidebar-primary": "oklch(0.646 0.222 41.116)",
    "sidebar-primary-foreground": "oklch(0.98 0.016 73.684)",
  },
  dark: {
    primary: "oklch(0.47 0.157 37.304)",
    "primary-foreground": "oklch(0.98 0.016 73.684)",
    secondary: "oklch(0.274 0.006 286.033)",
    "secondary-foreground": "oklch(0.985 0 0)",
    "chart-1": "oklch(0.837 0.128 66.29)",
    "chart-2": "oklch(0.705 0.213 47.604)",
    "chart-3": "oklch(0.646 0.222 41.116)",
    "chart-4": "oklch(0.553 0.195 38.402)",
    "chart-5": "oklch(0.47 0.157 37.304)",
    "sidebar-primary": "oklch(0.705 0.213 47.604)",
    "sidebar-primary-foreground": "oklch(0.98 0.016 73.684)",
  },
}

const AMBER: ThemeVarSets = {
  light: {
    primary: "oklch(0.555 0.163 48.998)",
    "primary-foreground": "oklch(0.987 0.022 95.277)",
    secondary: "oklch(0.967 0.001 286.375)",
    "secondary-foreground": "oklch(0.21 0.006 285.885)",
    "chart-1": "oklch(0.879 0.169 91.605)",
    "chart-2": "oklch(0.769 0.188 70.08)",
    "chart-3": "oklch(0.666 0.179 58.318)",
    "chart-4": "oklch(0.555 0.163 48.998)",
    "chart-5": "oklch(0.473 0.137 46.201)",
    "sidebar-primary": "oklch(0.666 0.179 58.318)",
    "sidebar-primary-foreground": "oklch(0.987 0.022 95.277)",
  },
  dark: {
    primary: "oklch(0.473 0.137 46.201)",
    "primary-foreground": "oklch(0.987 0.022 95.277)",
    secondary: "oklch(0.274 0.006 286.033)",
    "secondary-foreground": "oklch(0.985 0 0)",
    "chart-1": "oklch(0.879 0.169 91.605)",
    "chart-2": "oklch(0.769 0.188 70.08)",
    "chart-3": "oklch(0.666 0.179 58.318)",
    "chart-4": "oklch(0.555 0.163 48.998)",
    "chart-5": "oklch(0.473 0.137 46.201)",
    "sidebar-primary": "oklch(0.769 0.188 70.08)",
    "sidebar-primary-foreground": "oklch(0.279 0.077 45.635)",
  },
}

const GREEN: ThemeVarSets = {
  light: {
    primary: "oklch(0.527 0.154 150.069)",
    "primary-foreground": "oklch(0.982 0.018 155.826)",
    secondary: "oklch(0.967 0.001 286.375)",
    "secondary-foreground": "oklch(0.21 0.006 285.885)",
    "chart-1": "oklch(0.871 0.15 154.449)",
    "chart-2": "oklch(0.723 0.219 149.579)",
    "chart-3": "oklch(0.627 0.194 149.214)",
    "chart-4": "oklch(0.527 0.154 150.069)",
    "chart-5": "oklch(0.448 0.119 151.328)",
    "sidebar-primary": "oklch(0.627 0.194 149.214)",
    "sidebar-primary-foreground": "oklch(0.982 0.018 155.826)",
  },
  dark: {
    primary: "oklch(0.448 0.119 151.328)",
    "primary-foreground": "oklch(0.982 0.018 155.826)",
    secondary: "oklch(0.274 0.006 286.033)",
    "secondary-foreground": "oklch(0.985 0 0)",
    "chart-1": "oklch(0.871 0.15 154.449)",
    "chart-2": "oklch(0.723 0.219 149.579)",
    "chart-3": "oklch(0.627 0.194 149.214)",
    "chart-4": "oklch(0.527 0.154 150.069)",
    "chart-5": "oklch(0.448 0.119 151.328)",
    "sidebar-primary": "oklch(0.723 0.219 149.579)",
    "sidebar-primary-foreground": "oklch(0.982 0.018 155.826)",
  },
}

const BLUE: ThemeVarSets = {
  light: {
    primary: "oklch(0.488 0.243 264.376)",
    "primary-foreground": "oklch(0.97 0.014 254.604)",
    secondary: "oklch(0.967 0.001 286.375)",
    "secondary-foreground": "oklch(0.21 0.006 285.885)",
    "chart-1": "oklch(0.809 0.105 251.813)",
    "chart-2": "oklch(0.623 0.214 259.815)",
    "chart-3": "oklch(0.546 0.245 262.881)",
    "chart-4": "oklch(0.488 0.243 264.376)",
    "chart-5": "oklch(0.424 0.199 265.638)",
    "sidebar-primary": "oklch(0.546 0.245 262.881)",
    "sidebar-primary-foreground": "oklch(0.97 0.014 254.604)",
  },
  dark: {
    primary: "oklch(0.424 0.199 265.638)",
    "primary-foreground": "oklch(0.97 0.014 254.604)",
    secondary: "oklch(0.274 0.006 286.033)",
    "secondary-foreground": "oklch(0.985 0 0)",
    "chart-1": "oklch(0.809 0.105 251.813)",
    "chart-2": "oklch(0.623 0.214 259.815)",
    "chart-3": "oklch(0.546 0.245 262.881)",
    "chart-4": "oklch(0.488 0.243 264.376)",
    "chart-5": "oklch(0.424 0.199 265.638)",
    "sidebar-primary": "oklch(0.623 0.214 259.815)",
    "sidebar-primary-foreground": "oklch(0.97 0.014 254.604)",
  },
}

const VIOLET: ThemeVarSets = {
  light: {
    primary: "oklch(0.491 0.27 292.581)",
    "primary-foreground": "oklch(0.969 0.016 293.756)",
    secondary: "oklch(0.967 0.001 286.375)",
    "secondary-foreground": "oklch(0.21 0.006 285.885)",
    "chart-1": "oklch(0.811 0.111 293.571)",
    "chart-2": "oklch(0.606 0.25 292.717)",
    "chart-3": "oklch(0.541 0.281 293.009)",
    "chart-4": "oklch(0.491 0.27 292.581)",
    "chart-5": "oklch(0.432 0.232 292.759)",
    "sidebar-primary": "oklch(0.541 0.281 293.009)",
    "sidebar-primary-foreground": "oklch(0.969 0.016 293.756)",
  },
  dark: {
    primary: "oklch(0.432 0.232 292.759)",
    "primary-foreground": "oklch(0.969 0.016 293.756)",
    secondary: "oklch(0.274 0.006 286.033)",
    "secondary-foreground": "oklch(0.985 0 0)",
    "chart-1": "oklch(0.811 0.111 293.571)",
    "chart-2": "oklch(0.606 0.25 292.717)",
    "chart-3": "oklch(0.541 0.281 293.009)",
    "chart-4": "oklch(0.491 0.27 292.581)",
    "chart-5": "oklch(0.432 0.232 292.759)",
    "sidebar-primary": "oklch(0.606 0.25 292.717)",
    "sidebar-primary-foreground": "oklch(0.969 0.016 293.756)",
  },
}

function defineTheme<const Id extends string>(input: {
  id: Id
  name: string
  title: string
  description: string
  /** 基底变量集；彩色主题传 ZINC，再叠加 vars */
  base?: ThemeVarSets
  vars: ThemeVarSets
}) {
  const { base, vars, ...meta } = input
  const cssVars: ThemeVarSets = {
    light: { ...base?.light, ...vars.light },
    dark: { ...base?.dark, ...vars.dark },
  }
  return {
    ...meta,
    cssVars,
    preview: { light: cssVars.light.primary, dark: cssVars.dark.primary },
  } satisfies ColorTheme
}

export const COLOR_THEMES = [
  defineTheme({
    id: "neutral",
    name: "中性",
    title: "Neutral",
    description: "纯灰无色相的中性配色，shadcn 默认主题。",
    vars: NEUTRAL,
  }),
  defineTheme({
    id: "zinc",
    name: "锌灰",
    title: "Zinc",
    description: "带一点冷蓝的灰色，克制而干净。",
    vars: ZINC,
  }),
  defineTheme({
    id: "stone",
    name: "石灰",
    title: "Stone",
    description: "带一点暖黄的灰色，更柔和。",
    vars: STONE,
  }),
  defineTheme({
    id: "slate",
    name: "岩青",
    title: "Slate",
    description: "偏青蓝的灰色，适合技术向、文档类站点。",
    vars: SLATE,
  }),
  defineTheme({
    id: "rose",
    name: "玫瑰",
    title: "Rose",
    description: "饱和的玫红主色，叠加在锌灰基底上。",
    base: ZINC,
    vars: ROSE,
  }),
  defineTheme({
    id: "orange",
    name: "橙色",
    title: "Orange",
    description: "温暖的橙色主色，叠加在锌灰基底上。",
    base: ZINC,
    vars: ORANGE,
  }),
  defineTheme({
    id: "amber",
    name: "琥珀",
    title: "Amber",
    description: "深琥珀主色，叠加在锌灰基底上。",
    base: ZINC,
    vars: AMBER,
  }),
  defineTheme({
    id: "green",
    name: "翠绿",
    title: "Green",
    description: "沉稳的绿色主色，叠加在锌灰基底上。",
    base: ZINC,
    vars: GREEN,
  }),
  defineTheme({
    id: "blue",
    name: "海蓝",
    title: "Blue",
    description: "经典的蓝色主色，叠加在锌灰基底上。",
    base: ZINC,
    vars: BLUE,
  }),
  defineTheme({
    id: "violet",
    name: "紫罗兰",
    title: "Violet",
    description: "浓郁的紫色主色，叠加在锌灰基底上。",
    base: ZINC,
    vars: VIOLET,
  }),
] as const

export type ColorThemeId = (typeof COLOR_THEMES)[number]["id"]

export const DEFAULT_COLOR_THEME: ColorThemeId = "neutral"

/** 颜色主题在 localStorage 里的 key（亮暗模式由 next-themes 用 "theme" 管理） */
export const COLOR_THEME_STORAGE_KEY = "color-theme"

export function isColorTheme(value: unknown): value is ColorThemeId {
  return COLOR_THEMES.some((theme) => theme.id === value)
}

export function getColorTheme(id: string): (typeof COLOR_THEMES)[number] | undefined {
  return COLOR_THEMES.find((theme) => theme.id === id)
}

/** 把变量集渲染成 `selector { --k: v; }`，themes.css 与「复制代码」共用。 */
export function formatCssBlock(
  selector: string,
  vars: ThemeVars,
  indent = "  "
): string {
  const lines = Object.entries(vars).map(([key, value]) => `${indent}--${key}: ${value};`)
  return `${selector} {\n${lines.join("\n")}\n}`
}

/** 可直接粘贴到 globals.css 的 `:root` + `.dark` 两段。 */
export function formatThemeCss(theme: Pick<ColorTheme, "cssVars">): string {
  return [
    formatCssBlock(":root", theme.cssVars.light),
    formatCssBlock(".dark", theme.cssVars.dark),
  ].join("\n\n")
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
