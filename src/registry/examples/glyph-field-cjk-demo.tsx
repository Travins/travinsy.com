import { GlyphField } from "@/registry/ui/glyph-field/glyph-field"

// 外层加 `dark` 让这一块按暗色取色，字符和背景都跟着变
export default function GlyphFieldCjkDemo() {
  return (
    <GlyphField
      glyphs="cjk"
      tone={["green", "muted"]}
      fade="center"
      fontSize={18}
      density={0.55}
      paused
      className="dark h-72 rounded-lg text-foreground"
    >
      <p className="text-3xl font-medium tracking-widest">万物生长</p>
    </GlyphField>
  )
}
