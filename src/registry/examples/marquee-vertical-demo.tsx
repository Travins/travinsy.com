import MarqueeMotionDemo from "./marquee-motion-demo"
import { Marquee, MarqueeItem } from "@/registry/ui/marquee/marquee"

const ITEMS = [
  ["10:42", "跑马灯组件已发布", "新增四向滚动与交叉丝带。"],
  ["10:28", "构建完成", "全部页面已导出为静态文件。"],
  ["09:56", "文字动效就绪", "支持中文分字与乱码解码。"],
  ["09:30", "主题同步", "亮暗模式与颜色主题独立切换。"],
]

export default function MarqueeVerticalDemo() {
  return (
    <MarqueeMotionDemo>
      <div className="w-full max-w-md px-4 py-6">
        <Marquee
          direction="up"
          speed={22}
          gap={16}
          className="h-64"
          label="组件库更新动态"
        >
          {ITEMS.map(([time, title, description]) => (
            <MarqueeItem
              key={time}
              className="w-full items-start gap-4 border-b border-edge px-2 pb-4 whitespace-normal"
            >
              <span className="pt-1 font-mono text-[10px] text-muted-foreground">
                {time}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">{title}</span>
                <span className="text-xs leading-5 text-muted-foreground">
                  {description}
                </span>
              </div>
            </MarqueeItem>
          ))}
        </Marquee>
      </div>
    </MarqueeMotionDemo>
  )
}
