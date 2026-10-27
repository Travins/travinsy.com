import type { SegmentedOption } from "./types"

/** 色调小样：圆点取对应的主题 / 多彩变量，跟随亮暗与颜色主题；`null` 是空心圆（不上色） */
export function ToneSwatch({ tone }: { tone: string | null }) {
  const color = tone === "primary" ? "var(--primary)" : `var(--flow-${tone})`
  return (
    <span
      aria-hidden="true"
      className="size-2.5 shrink-0 rounded-full border border-edge"
      style={
        tone ? { background: color, borderColor: "transparent" } : undefined
      }
    />
  )
}

const TONES = ["primary", "blue", "green", "amber", "rose", "violet", "cyan"]

/** 色调选项：可选的首项（如「原样」）+ 「主题」（不上色）+ 内置色调 */
export function toneOptions(first?: SegmentedOption): SegmentedOption[] {
  return [
    ...(first ? [first] : []),
    { value: "theme", label: "主题", swatch: <ToneSwatch tone={null} /> },
    ...TONES.map((tone) => ({
      value: tone,
      label: tone,
      swatch: <ToneSwatch tone={tone} />,
    })),
  ]
}
