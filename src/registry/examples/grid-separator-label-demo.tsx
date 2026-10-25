import {
  GridContainer,
  GridSection,
  GridSeparator,
} from "@/registry/ui/grid-layout/grid-layout"

export default function GridSeparatorLabelDemo() {
  return (
    <GridContainer className="max-w-lg bg-background">
      <GridSection className="px-4 py-6">
        <p className="text-sm text-muted-foreground">
          给分隔带加一个编号，像图纸上的章节标记。
        </p>
      </GridSection>
      <GridSeparator label="01 / OVERVIEW" />
      <GridSection className="px-4 py-6">
        <p className="text-sm text-muted-foreground">
          编号可以和任意纹路组合。
        </p>
      </GridSection>
      <GridSeparator pattern="hatch" label="02 / PROJECTS" />
      <GridSection className="px-4 py-6">
        <p className="text-sm text-muted-foreground">
          只想要编号和虚线时用 none。
        </p>
      </GridSection>
      <GridSeparator pattern="none" label="03 / NOTES" crosshair />
    </GridContainer>
  )
}
