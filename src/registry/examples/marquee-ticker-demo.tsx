import MarqueeMotionDemo from "./marquee-motion-demo"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { Marquee, MarqueeItem } from "@/registry/ui/marquee/marquee"

const ITEMS = [
  { label: "组件安装", value: "12,840", change: "+12.4%", up: true },
  { label: "Star", value: "2,048", change: "+8.2%", up: true },
  { label: "周下载", value: "36,210", change: "+16.8%", up: true },
  { label: "构建耗时", value: "24.6s", change: "−3.2%", up: false },
]

export default function MarqueeTickerDemo() {
  return (
    <MarqueeMotionDemo>
      <div className="flex w-full min-w-0 flex-col gap-5 py-8">
        <p className="px-5 font-mono text-xs text-muted-foreground">
          项目脉搏 / 演示数据
        </p>
        <Marquee speed={32} gap={12} label="组件安装、Star、下载与构建耗时">
          {ITEMS.map((item) => (
            <MarqueeItem
              key={item.label}
              className="rounded-full border border-edge bg-card px-4 py-3 text-xs"
            >
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-mono font-semibold">{item.value}</span>
              <span className="flex items-center gap-1 font-mono text-primary">
                {item.up ? (
                  <ArrowUpRight className="size-3.5" />
                ) : (
                  <ArrowDownRight className="size-3.5" />
                )}
                {item.change}
              </span>
            </MarqueeItem>
          ))}
        </Marquee>
      </div>
    </MarqueeMotionDemo>
  )
}
