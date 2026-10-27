import {
  StatCard,
  StatHeader,
  StatLabel,
  StatValue,
  StatZones,
} from "@/registry/ui/stat-card/stat-card"

const ZONES = [
  { label: "快", range: "< 50 ms", share: 62.4 },
  { label: "正常", range: "50–200 ms", share: 28.1 },
  { label: "慢", range: "200–500 ms", share: 7.6 },
  { label: "严重", range: "> 500 ms", share: 1.9 },
]

export default function StatCardLatencyDemo() {
  return (
    <StatCard className="w-full max-w-md">
      <StatHeader>
        <div className="flex flex-col gap-2">
          <StatLabel>/api/posts 平均响应</StatLabel>
          <StatValue value={86} unit="ms" size="lg" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatLabel>请求数</StatLabel>
          <StatValue value={1284000} size="sm" />
        </div>
      </StatHeader>
      <StatZones zones={ZONES} />
    </StatCard>
  )
}
