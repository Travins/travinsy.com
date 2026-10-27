import { GlyphField } from "@/registry/ui/glyph-field/glyph-field"

export default function GlyphFieldBinaryDemo() {
  return (
    <GlyphField
      glyphs="binary"
      tone="primary"
      fade="none"
      fontSize={16}
      density={0.5}
      paused
      className="min-h-40 rounded-lg"
    >
      <p className="rounded-md border border-edge bg-background px-5 py-2 font-mono text-sm tracking-wider">
        数据始终在路上
      </p>
    </GlyphField>
  )
}
