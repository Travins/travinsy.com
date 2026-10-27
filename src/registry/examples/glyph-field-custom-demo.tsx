import { GlyphField } from "@/registry/ui/glyph-field/glyph-field"

// 任意字符串都可以当字符集；色调数组里重复某个值，可以提高它出现的频率
export default function GlyphFieldCustomDemo() {
  return (
    <GlyphField
      glyphs="{}[]()<>/=+-*;:#"
      tone={["violet", "violet", "blue", "muted"]}
      fade="edges"
      paused
      className="min-h-56 rounded-lg"
    >
      <p className="rounded-md border border-edge bg-background px-4 py-2 font-mono text-sm">
        pnpm build
      </p>
    </GlyphField>
  )
}
