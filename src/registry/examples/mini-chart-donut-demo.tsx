import { toneColor } from "@/registry/lib/data-display"
import { MiniDonut } from "@/registry/ui/mini-chart/mini-chart"

const SEGMENTS = [
  { label: "文档", value: 5320, tone: "blue" },
  { label: "博客", value: 3180, tone: "amber" },
  { label: "组件库", value: 2140, tone: "green" },
] as const

const TOTAL = SEGMENTS.reduce((sum, item) => sum + item.value, 0)

export default function MiniChartDonutDemo() {
  return (
    <div className="flex items-center gap-6">
      <MiniDonut size={112} segments={[...SEGMENTS]} label="各栏目访问量占比">
        <span className="text-lg font-semibold">1.1万</span>
        <span className="text-[11px] text-muted-foreground">总访问</span>
      </MiniDonut>
      <ul className="flex flex-col gap-2 text-sm">
        {SEGMENTS.map((segment) => (
          <li key={segment.label} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-2 rounded-full"
              style={{ backgroundColor: toneColor(segment.tone) }}
            />
            <span className="text-muted-foreground">{segment.label}</span>
            <span className="ml-2 font-medium tabular-nums">
              {Math.round((segment.value / TOTAL) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
