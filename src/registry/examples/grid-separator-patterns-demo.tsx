import {
  GridContainer,
  GridSection,
  GridSeparator,
  type GridSeparatorPattern,
} from "@/registry/ui/grid-layout/grid-layout"

const patterns: { pattern: GridSeparatorPattern; note: string }[] = [
  { pattern: "dots", note: "点阵 · 默认" },
  { pattern: "ruler", note: "刻度尺" },
  { pattern: "hatch", note: "斜纹 · 局部强调" },
  { pattern: "grid", note: "坐标细网格" },
  { pattern: "plus", note: "十字阵列" },
  { pattern: "wave", note: "信号波形" },
]

export default function GridSeparatorPatternsDemo() {
  return (
    <GridContainer className="bg-background [--grid-width:32rem]">
      {patterns.map(({ pattern, note }) => (
        <div key={pattern}>
          <GridSection className="flex items-baseline justify-between px-4 py-3">
            <code className="font-mono text-xs">
              pattern=&quot;{pattern}&quot;
            </code>
            <span className="text-xs text-muted-foreground">{note}</span>
          </GridSection>
          <GridSeparator pattern={pattern} />
        </div>
      ))}
    </GridContainer>
  )
}
