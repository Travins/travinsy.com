import { MiniRing } from "@/registry/ui/mini-chart/mini-chart"

export default function MiniChartRingDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <MiniRing value={72} label="构建配额已用 72%" />
        <span className="text-xs text-muted-foreground">整圆</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <MiniRing
          value={86}
          arc={270}
          tone="green"
          size={88}
          label="可用率 86%"
        >
          <span className="text-base font-semibold">99.9</span>
          <span className="text-[11px] text-muted-foreground">可用率 %</span>
        </MiniRing>
        <span className="text-xs text-muted-foreground">270° 仪表</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <MiniRing
          value={4}
          max={5}
          tone="amber"
          thickness={14}
          label="目标完成 4/5"
        >
          <span className="text-sm font-semibold">4/5</span>
        </MiniRing>
        <span className="text-xs text-muted-foreground">粗环</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <MiniRing
          value={32}
          tone="rose"
          size={56}
          thickness={12}
          label="磁盘 32%"
        />
        <span className="text-xs text-muted-foreground">小尺寸</span>
      </div>
    </div>
  )
}
