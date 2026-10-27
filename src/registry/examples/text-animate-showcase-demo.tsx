"use client"

import * as React from "react"
import { useInView } from "motion/react"
import {
  TextFlip,
  TextHighlight,
  TextReveal,
  TextScramble,
} from "@/registry/ui/text-animate/text-animate"

const STATUS = [
  "DECODING → 构建完成",
  "RENDERING → 页面就绪",
  "SHIPPING → 已经上线",
]

/**
 * 列表封面：四种效果同时在一张图里循环播放——顶部解码、标题关键词轮换、
 * 副标题逐字显现、关键词高亮扫过。每 3.6 秒重放一轮，离屏时停止计时。
 */
export default function TextAnimateShowcaseDemo() {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  const [tick, setTick] = React.useState(0)

  React.useEffect(() => {
    if (!inView) return
    const id = window.setInterval(() => setTick((value) => value + 1), 3600)
    return () => window.clearInterval(id)
  }, [inView])

  return (
    <div
      ref={ref}
      className="relative flex size-full min-w-0 flex-col justify-center gap-4 overflow-hidden bg-dots px-7 py-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_6%,color-mix(in_oklab,var(--flow-blue)_20%,transparent),transparent_52%),radial-gradient(ellipse_at_6%_104%,color-mix(in_oklab,var(--flow-violet)_14%,transparent),transparent_50%)]"
      />
      <TextScramble
        key={`status-${tick}`}
        trigger="mount"
        duration={1200}
        className="relative font-mono text-[10px] tracking-[0.2em] text-(--flow-green)"
      >
        {STATUS[tick % STATUS.length]}
      </TextScramble>
      <div className="relative flex flex-col items-start gap-2 text-3xl leading-tight font-semibold tracking-tight">
        <span>把界面</span>
        <span>
          写成{" "}
          <TextFlip
            className="[--primary:var(--flow-blue)]"
            interval={1800}
            words={["组件", "系统", "积木", "产品"]}
          />
        </span>
      </div>
      <div className="relative flex flex-col gap-1.5 text-xs text-muted-foreground">
        <TextReveal key={`reveal-${tick}`} trigger="mount" by="char">
          从一个词开始，到一整套界面。
        </TextReveal>
        <span>
          用{" "}
          <TextHighlight
            key={`mark-${tick}`}
            trigger="mount"
            tone="amber"
            className="text-foreground"
          >
            细节
          </TextHighlight>{" "}
          打动人，用{" "}
          <TextHighlight
            key={`line-${tick}`}
            trigger="mount"
            tone="violet"
            variant="underline"
            className="text-foreground"
          >
            留白
          </TextHighlight>{" "}
          给内容呼吸。
        </span>
      </div>
    </div>
  )
}
