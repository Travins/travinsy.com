import { GlyphField } from "@/registry/ui/glyph-field/glyph-field"

export default function GlyphFieldCjkDemo() {
  return (
    <GlyphField
      glyphs="cjk"
      tone={["green", "muted"]}
      paused
      fontSize={18}
      density={0.55}
      className="dark h-80 rounded-lg border border-edge bg-background text-foreground"
    >
      <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground">
        文字之间，自有秩序
      </p>
      <p className="mt-4 text-3xl font-medium tracking-widest">万物生长</p>
    </GlyphField>
  )
}
