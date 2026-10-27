import {
  ChartCard,
  ChartCardContent,
  ChartCardDescription,
  ChartCardHeader,
  ChartCardTitle,
  ChartRanking,
} from "@/registry/ui/chart-card/chart-card"

const PAGES = [
  { label: "组件库 · 线条网格", value: 99 },
  { label: "智能体开发引导", value: 94 },
  { label: "博客 · 静态导出实战", value: 80 },
  { label: "文档 · 快速开始", value: 68 },
  { label: "组件库 · 世界时钟", value: 52 },
  { label: "关于我", value: 45 },
]

export default function ChartCardRankingDemo() {
  return (
    <ChartCard className="w-full max-w-3xl">
      <ChartCardHeader>
        <div className="flex flex-col gap-1">
          <ChartCardTitle>热门页面</ChartCardTitle>
          <ChartCardDescription>按近 30 天阅读完成率排名</ChartCardDescription>
        </div>
      </ChartCardHeader>
      <ChartCardContent>
        <ChartRanking items={PAGES} max={100} label="热门页面阅读完成率排名" />
      </ChartCardContent>
    </ChartCard>
  )
}
