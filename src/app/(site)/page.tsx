import {
  GridColumns,
  GridContainer,
  GridSection,
  GridSeparator,
} from "@/registry/ui/grid-layout/grid-layout"

export default function HomePage() {
  return (
    <GridContainer>
      <GridSection className="px-4 py-12">
        <h1 className="text-4xl font-semibold tracking-tight">travinsy</h1>
      </GridSection>
      <GridSeparator />
      <GridSection>
        <GridColumns>
          <div className="p-4 font-mono text-sm">左栏</div>
          <div className="p-4 font-mono text-sm">右栏</div>
        </GridColumns>
      </GridSection>
    </GridContainer>
  )
}
