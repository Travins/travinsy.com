import { cn } from "@/lib/utils"
import { Marquee, MarqueeItem } from "@/registry/ui/marquee/marquee"

const WORDS = ["线条网格", "LINE GRID", "组件库", "开源", "BUILD WITH CARE"]

// 两条丝带反向滚动，旋转后在中间交叉；开启「减少动态效果」时回到水平，所以各自错开位置
const RIBBONS = [
  {
    rotate: -9,
    direction: "left",
    className: "bg-foreground text-background motion-reduce:top-1/3",
  },
  {
    rotate: 9,
    direction: "right",
    className:
      "border-y border-edge bg-muted text-foreground motion-reduce:top-2/3",
  },
] as const

export default function MarqueeDemo() {
  return (
    <div className="relative h-56 w-full overflow-hidden bg-dots">
      {RIBBONS.map(({ rotate, direction, className }) => (
        <Marquee
          key={rotate}
          label="线条网格与组件库"
          rotate={rotate}
          direction={direction}
          speed={42}
          fade={false}
          className={cn(
            "absolute top-1/2 -left-[10%] w-[120%] -translate-y-1/2 py-4 motion-reduce:left-0 motion-reduce:w-full",
            className,
          )}
        >
          {WORDS.map((word) => (
            <MarqueeItem
              key={word}
              className="gap-8 text-lg font-semibold tracking-tight sm:text-2xl"
            >
              {word}
              <span aria-hidden className="text-sm opacity-50">
                ✳
              </span>
            </MarqueeItem>
          ))}
        </Marquee>
      ))}
    </div>
  )
}
