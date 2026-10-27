import {
  MiniChart,
  type MiniChartType,
} from "@/registry/ui/mini-chart/mini-chart"

const DATA = [12, 18, 15, 24, 21, 30, 26, 34, 29, 38, 35, 42]

const TYPES: { type: MiniChartType; name: string }[] = [
  { type: "bar", name: "柱 bar" },
  { type: "line", name: "折线 line" },
  { type: "area", name: "面积 area" },
  { type: "step", name: "阶梯 step" },
]

export default function MiniChartTypesDemo() {
  return (
    <div className="grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
      {TYPES.map(({ type, name }) => (
        <div
          key={type}
          className="flex flex-col gap-2 rounded-lg border border-edge p-3"
        >
          <span className="font-mono text-xs text-muted-foreground">
            {name}
          </span>
          <MiniChart type={type} data={DATA} label={`${name}图`} />
        </div>
      ))}
    </div>
  )
}
