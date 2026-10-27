import { GlyphField } from "@/registry/ui/glyph-field/glyph-field"

export default function GlyphFieldBinaryDemo() {
  return (
    <GlyphField
      glyphs="binary"
      tone="primary"
      paused
      fade="edges"
      density={0.65}
      className="min-h-44 rounded-lg"
    >
      <p className="bg-background/90 px-5 py-2 font-mono text-sm tracking-wider">
        数据始终在路上
      </p>
    </GlyphField>
  )
}
