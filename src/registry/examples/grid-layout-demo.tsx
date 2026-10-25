import {
  GridColumns,
  GridContainer,
  GridSection,
  GridSeparator,
} from "@/registry/ui/grid-layout/grid-layout"

export default function GridLayoutDemo() {
  return (
    <GridContainer className="max-w-lg bg-background">
      <GridSection className="px-4 py-6">
        <p className="font-mono text-xs text-muted-foreground">
          01 / GRID LAYOUT
        </p>
        <h3 className="mt-2 text-xl font-semibold">让内容，落在线条之间。</h3>
      </GridSection>
      <GridSeparator className="h-5" />
      <GridSection>
        <GridColumns>
          <div className="p-4">
            <p className="font-medium">清晰的结构</p>
            <p className="mt-2 text-sm text-muted-foreground">
              横线延伸，竖线收束。
            </p>
          </div>
          <div className="p-4">
            <p className="font-medium">恰好的留白</p>
            <p className="mt-2 text-sm text-muted-foreground">
              窄屏堆叠，自然呼吸。
            </p>
          </div>
        </GridColumns>
      </GridSection>
    </GridContainer>
  )
}
