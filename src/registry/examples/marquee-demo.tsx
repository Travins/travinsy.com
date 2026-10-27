import MarqueeMotionDemo from "./marquee-motion-demo"
import { Marquee, MarqueeItem } from "@/registry/ui/marquee/marquee"
import { GridCrosshair } from "@/registry/ui/grid-layout/grid-layout"

const WORDS = ["线条网格", "LINE GRID", "组件库", "开源", "BUILD WITH CARE"]

export default function MarqueeDemo() {
  return (
    <MarqueeMotionDemo>
      <div className="relative flex h-80 w-full min-w-0 flex-col justify-between overflow-hidden bg-dots py-6 sm:h-96">
        <div className="flex justify-between px-6 font-mono text-[10px] tracking-widest text-muted-foreground">
          <span>DESIGN IN MOTION</span>
          <span>01 / MARQUEE</span>
        </div>
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden
        >
          <span className="font-mono text-[7rem] font-semibold tracking-tighter text-foreground/4 sm:text-[11rem]">
            Aa
          </span>
        </div>
        <div className="relative h-28">
          <Marquee
            label="开源组件与线条网格"
            rotate={-9}
            speed={42}
            fade={false}
            gap={32}
            className="absolute top-6 -left-[15%] w-[130%] bg-foreground py-4 text-background shadow-sm motion-reduce:top-0 motion-reduce:left-0 motion-reduce:w-full"
          >
            {WORDS.map((word) => (
              <MarqueeItem
                key={word}
                className="text-lg font-semibold tracking-tight sm:text-2xl"
              >
                {word}
                <span className="ml-5 text-sm opacity-50" aria-hidden>
                  ✳
                </span>
              </MarqueeItem>
            ))}
          </Marquee>
          <Marquee
            label="线条网格组件库"
            rotate={9}
            direction="right"
            speed={42}
            fade={false}
            gap={32}
            className="absolute top-6 -left-[15%] w-[130%] bg-(--flow-blue) py-4 text-background shadow-sm motion-reduce:top-16 motion-reduce:left-0 motion-reduce:w-full"
          >
            {WORDS.map((word) => (
              <MarqueeItem
                key={word}
                className="text-lg font-semibold tracking-tight sm:text-2xl"
              >
                {word}
                <span className="ml-5 text-sm opacity-60" aria-hidden>
                  ✳
                </span>
              </MarqueeItem>
            ))}
          </Marquee>
        </div>
        <div className="flex justify-between pr-14 pl-6 font-mono text-[10px] text-muted-foreground">
          <span>让内容，自由流动。</span>
          <span>CSS / ∞</span>
        </div>
        <GridCrosshair position="top-left" className="top-4 left-4" />
        <GridCrosshair position="bottom-right" className="right-4 bottom-4" />
      </div>
    </MarqueeMotionDemo>
  )
}
