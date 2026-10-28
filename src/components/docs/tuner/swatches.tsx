import type { ToneOption } from "./types"

const TONES = ["primary", "blue", "green", "amber", "rose", "violet", "cyan"]

/**
 * 色调选项：可选的首项（如「原样」，画成虚线空心圆）+「主题」（不上色，色点用弱化前景色）+ 内置色调。
 * 交给面板里的 TonePicker 渲染，色点颜色都来自主题变量。
 */
export function toneOptions(first?: { value: string; label: string }) {
  return [
    ...(first ? [{ ...first, tone: null }] : []),
    { value: "theme", label: "主题", tone: "muted" },
    ...TONES.map((tone) => ({ value: tone, label: tone, tone })),
  ] satisfies ToneOption[]
}
