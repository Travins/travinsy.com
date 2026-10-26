import {
  GridContainer,
  GridCrosshair,
  GridSection,
  GridSeparator,
} from "@/registry/ui/grid-layout/grid-layout"

export default function GridCrosshairDemo() {
  return (
    <GridContainer className="bg-background [--grid-width:32rem]">
      {/* GridSection：在底线两端的交点画十字 */}
      <GridSection className="px-4 py-6 sm:px-6" crosshair>
        <p className="font-mono text-xs text-muted-foreground">
          {"<GridSection crosshair />"}
        </p>
      </GridSection>

      {/* GridSeparator：四个角都有十字 */}
      <GridSeparator pattern="none" label="GridSeparator crosshair" crosshair />

      {/* GridCrosshair：放在带 relative 的卡片四角，anchor="border" 对齐卡片自己的边框 */}
      <GridSection className="px-4 py-8 sm:px-6">
        <div className="relative border border-edge p-5">
          <GridCrosshair position="top-left" anchor="border" />
          <GridCrosshair position="top-right" anchor="border" />
          <GridCrosshair position="bottom-left" anchor="border" />
          <GridCrosshair position="bottom-right" anchor="border" />
          <p className="font-medium">单独的十字</p>
          <p className="mt-1 text-sm text-muted-foreground">
            四个角各放一个 GridCrosshair，像图纸上的定位标记。
          </p>
        </div>
      </GridSection>
    </GridContainer>
  )
}
