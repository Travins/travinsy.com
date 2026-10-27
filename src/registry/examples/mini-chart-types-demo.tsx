import {
  MiniChart,
  type MiniChartType,
} from "@/registry/ui/mini-chart/mini-chart"

const DATA = [12, 18, 15, 24, 21, 30, 26, 34, 29, 38, 35, 42]

const TYPES: MiniChartType[] = ["bar", "line", "area", "step"]

export default function MiniChartTypesDemo() {
  return (
    <div className="grid w-full max-w-3xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
      {TYPES.map((type) => (
        <figure key={type} className="flex flex-col gap-3">
          <MiniChart type={type} data={DATA} label={`${type} 类型示例`} />
          <figcaption className="font-mono text-xs text-muted-foreground">
            type=&quot;{type}&quot;
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
