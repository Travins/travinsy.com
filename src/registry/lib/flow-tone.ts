import type { CSSProperties } from "react"

/**
 * 内置色调。
 * - `primary`、`foreground`、`muted`、`destructive` 直接引用主题变量，跟随颜色主题；
 * - `blue` 等多彩色调引用 `--flow-blue` 这类变量，由 registry 条目的 `cssVars` 提供亮 / 暗两套取值，
 *   在自己的全局样式里改写它们即可换成品牌色。
 */
type FlowToneName =
  | "primary"
  | "foreground"
  | "muted"
  | "destructive"
  | "blue"
  | "green"
  | "amber"
  | "rose"
  | "violet"
  | "cyan"

/** 色调：内置名，或任意 CSS 颜色（`"#f97316"`、`"oklch(0.7 0.2 150)"`、`"var(--brand)"` 都可以）。 */
type FlowTone = FlowToneName | (string & {})

const FLOW_TONES: Record<FlowToneName, string> = {
  primary: "var(--primary)",
  foreground: "var(--foreground)",
  muted: "var(--muted-foreground)",
  destructive: "var(--destructive)",
  blue: "var(--flow-blue)",
  green: "var(--flow-green)",
  amber: "var(--flow-amber)",
  rose: "var(--flow-rose)",
  violet: "var(--flow-violet)",
  cyan: "var(--flow-cyan)",
}

/**
 * 把色调换成 `--flow-tone` 这个 CSS 变量。
 * 所有带颜色的原语都只读 `--flow-tone`，变量沿 DOM 向下继承，所以在任何元素（包括你自己写的 SVG）
 * 上设置它，里面没有指定 `tone` 的原语都会跟着变。不传 `tone` 返回 `undefined`，即沿用外层的色调。
 */
function flowToneStyle(tone?: FlowTone): CSSProperties | undefined {
  if (tone === undefined) return undefined
  const color = Object.hasOwn(FLOW_TONES, tone)
    ? FLOW_TONES[tone as FlowToneName]
    : tone
  return { "--flow-tone": color } as CSSProperties
}

// Tailwind 只识别完整的类名，所以每种用法都把类写全
const toneClasses = {
  /** 节点被点亮：淡底色 + 描边 */
  lit: "fill-(--flow-tone)/10 stroke-(--flow-tone)",
  stroke: "stroke-(--flow-tone)",
  /** 常驻连接上流动的虚线纹理 */
  flow: "stroke-(--flow-tone)/40",
  /** 指定了色调的连线：淡淡染上色调 */
  line: "stroke-(--flow-tone)/30",
  fill: "fill-(--flow-tone)",
} as const

export { FLOW_TONES, flowToneStyle, toneClasses }
export type { FlowTone, FlowToneName }
