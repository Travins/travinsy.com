import { ChartGauge } from "@/registry/ui/chart-card/chart-card"

/** 列表封面：刻度仪表放在点阵底纹上，是这组组件最醒目的一个。 */
export default function ChartCardShowcaseDemo() {
  return (
    <div className="relative flex size-full items-center justify-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />
      <div className="relative flex items-center gap-6">
        <ChartGauge
          value={78}
          caption="年度目标"
          className="size-44"
          label="年度目标完成 78%"
        />
        <ChartGauge
          value={92}
          tone="green"
          caption="可用率"
          className="hidden size-28 sm:block"
          label="可用率 92%"
        />
      </div>
    </div>
  )
}
