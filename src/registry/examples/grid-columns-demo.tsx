import {
  GridColumns,
  GridContainer,
  GridSection,
} from "@/registry/ui/grid-layout/grid-layout"

const stats = [
  { value: "5", label: "布局原语" },
  { value: "6", label: "分隔纹路" },
  { value: "14", label: "颜色主题" },
]

const cards = [
  { title: "窄屏堆叠", note: "默认两栏，窄屏自动变成一栏，栏间换成横向虚线。" },
  { title: "栏数可调", note: "用 className 改列数，比如三栏写 sm:grid-cols-3。" },
]

export default function GridColumnsDemo() {
  return (
    <GridContainer className="bg-background [--grid-width:32rem]">
      {/* 三栏：覆盖默认的两列 */}
      <GridSection>
        <GridColumns className="sm:grid-cols-3">
          {stats.map(({ value, label }) => (
            <div key={label} className="p-4 sm:p-6">
              <p className="font-mono text-2xl font-semibold tracking-tight">
                {value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </GridColumns>
      </GridSection>

      {/* 两栏：默认行为 */}
      <GridSection>
        <GridColumns>
          {cards.map(({ title, note }) => (
            <div key={title} className="p-4 sm:p-6">
              <p className="font-medium">{title}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {note}
              </p>
            </div>
          ))}
        </GridColumns>
      </GridSection>
    </GridContainer>
  )
}
