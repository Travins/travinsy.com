import { ShieldCheck } from "lucide-react"
import { GlyphField } from "@/registry/ui/glyph-field/glyph-field"
import {
  StatCard,
  StatHeader,
  StatLabel,
  StatValue,
  StatIcon,
} from "@/registry/ui/stat-card/stat-card"

export default function GlyphFieldStatDemo() {
  return (
    <StatCard className="relative w-full max-w-md overflow-hidden p-0">
      <GlyphField
        glyphs="hex"
        tone="primary"
        paused
        fade="center"
        className="min-h-60"
      >
        <div className="w-64 max-w-full px-4 text-left">
          <StatHeader>
            <StatLabel>今日威胁拦截</StatLabel>
            <StatIcon tone="primary">
              <ShieldCheck />
            </StatIcon>
          </StatHeader>
          <StatValue value={24816} size="lg" className="mt-4" />
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            所有异常请求均已隔离，服务正常。
          </p>
        </div>
      </GlyphField>
    </StatCard>
  )
}
