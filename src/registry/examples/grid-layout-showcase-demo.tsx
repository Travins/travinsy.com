import {
  GridColumns,
  GridContainer,
  GridSection,
  GridSeparator,
  type GridSeparatorPattern,
} from "@/registry/ui/grid-layout/grid-layout"

const PATTERNS: readonly GridSeparatorPattern[] = [
  "dots",
  "ruler",
  "hatch",
  "grid",
  "plus",
  "wave",
]

/**
 * 线条网格封面：一屏里出现竖线容器、全宽横线、刻度尺与斜纹分隔带、虚线分栏和交点十字。
 * 竖线撑满整张封面，内容只占上半部分，静帧也能看出「线条建立秩序」。
 */
export default function GridLayoutShowcaseDemo() {
  return (
    <GridContainer className="flex h-full flex-col bg-background/70 [--grid-width:20rem]">
      <GridSection className="px-4 py-5" crosshair>
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground">
          01 / GRID LAYOUT
        </p>
        <h3 className="mt-1.5 text-lg font-semibold tracking-tight">
          让内容，落在线条之间。
        </h3>
      </GridSection>
      <GridSeparator pattern="ruler" label="02 / LINES" />
      <GridSection>
        <GridColumns className="grid-cols-2 divide-x divide-y-0">
          <div className="p-3">
            <p className="text-sm font-medium">清晰的结构</p>
            <p className="mt-1 text-xs text-muted-foreground">
              横线延伸，竖线收束。
            </p>
          </div>
          <div className="p-3">
            <p className="text-sm font-medium">恰好的留白</p>
            <p className="mt-1 text-xs text-muted-foreground">
              窄屏堆叠，自然呼吸。
            </p>
          </div>
        </GridColumns>
      </GridSection>
      <GridSeparator pattern="hatch" />
      <GridSection className="flex flex-1 flex-wrap content-center gap-1.5 px-4 py-3">
        {PATTERNS.map((pattern) => (
          <span
            key={pattern}
            className="rounded-sm border border-edge px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
          >
            {pattern}
          </span>
        ))}
      </GridSection>
    </GridContainer>
  )
}
