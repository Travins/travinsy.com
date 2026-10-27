import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Marquee, MarqueeItem } from "@/registry/ui/marquee/marquee"

// 固定的演示数据，不连接任何实时服务
const STATS = [
  { label: "组件安装", value: "12,840", change: "+12.4%", up: true },
  { label: "Star", value: "2,048", change: "+8.2%", up: true },
  { label: "周下载", value: "36,210", change: "+16.8%", up: true },
  { label: "构建耗时", value: "24.6s", change: "−3.2%", up: false },
]

export default function MarqueeTickerDemo() {
  return (
    <Marquee speed={32} gap={12} label="组件安装、Star、下载与构建耗时">
      {STATS.map(({ label, value, change, up }) => (
        <MarqueeItem
          key={label}
          className="rounded-full border border-edge bg-card px-4 py-2.5 text-xs"
        >
          <span className="text-muted-foreground">{label}</span>
          <span className="font-mono font-semibold">{value}</span>
          <span
            className={cn(
              "flex items-center gap-1 font-mono",
              up ? "text-primary" : "text-muted-foreground",
            )}
          >
            {up ? (
              <ArrowUpRight className="size-3.5" aria-hidden />
            ) : (
              <ArrowDownRight className="size-3.5" aria-hidden />
            )}
            {change}
          </span>
        </MarqueeItem>
      ))}
    </Marquee>
  )
}
