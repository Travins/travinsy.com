import { ChartGauge } from "@/registry/ui/chart-card/chart-card"

export default function ChartCardGaugeDemo() {
  return (
    <div className="grid w-full max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
      <div className="flex flex-col items-center gap-2">
        <ChartGauge
          value={78}
          caption="已完成"
          className="size-36"
          label="完成 78%"
        />
        <span className="text-xs text-muted-foreground">默认 · 270°</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ChartGauge
          value={92}
          arc={360}
          tone="green"
          caption="可用率"
          className="size-36"
          label="可用率 92%"
        />
        <span className="text-xs text-muted-foreground">整圈 · 绿色</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ChartGauge
          value={64}
          ticks={36}
          tone="blue"
          fade={false}
          className="size-36"
          label="配额 64%"
          caption="配额"
        />
        <span className="text-xs text-muted-foreground">36 刻度 · 不渐变</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ChartGauge
          value={31}
          arc={240}
          ticks={48}
          tone="rose"
          className="size-36"
          label="磁盘 31%"
        >
          <span className="text-2xl font-semibold">31</span>
          <span className="text-xs text-muted-foreground">GB 剩余</span>
        </ChartGauge>
        <span className="text-xs text-muted-foreground">自定义中心</span>
      </div>
    </div>
  )
}
