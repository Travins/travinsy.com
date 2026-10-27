import { LockKeyhole } from "lucide-react"
import { GlyphField } from "@/registry/ui/glyph-field/glyph-field"

/** 列表封面：铺满缩略图，中心只留盾牌与一行标题，不带四角标注和控制按钮。 */
export default function GlyphFieldShowcaseDemo() {
  return (
    <GlyphField
      glyphs="hex"
      tone={["muted", "primary", "muted"]}
      fade="center"
      fontSize={12}
      label="十六进制字符背景上的安全访问盾牌"
      className="size-full min-h-0"
    >
      <div className="relative mb-3 flex size-24 items-center justify-center text-primary">
        <div className="absolute inset-3 rounded-full bg-primary/15 blur-2xl" />
        <svg
          aria-hidden="true"
          viewBox="0 0 120 136"
          className="absolute h-full w-20 overflow-visible fill-primary/5 stroke-primary"
          strokeWidth="1.5"
        >
          <path d="M60 7 105 25v39c0 29-23 48-45 62C38 112 15 93 15 64V25Z" />
          <path
            d="m60 18 35 15v31c0 22-16 39-35 51-19-12-35-29-35-51V33Z"
            strokeDasharray="3 5"
            className="stroke-primary/40"
          />
        </svg>
        <LockKeyhole
          aria-hidden="true"
          className="relative size-7"
          strokeWidth={1.4}
        />
      </div>
      <span className="mb-1 font-mono text-[10px] tracking-[0.24em] text-primary">
        ACCESS VERIFIED
      </span>
      <p className="text-xl font-semibold tracking-tight">安全访问</p>
    </GlyphField>
  )
}
