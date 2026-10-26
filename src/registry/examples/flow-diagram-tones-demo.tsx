import type { CSSProperties } from "react"

import {
  FlowDiagram,
  FlowLabel,
  FlowNode,
  FlowReveal,
  type FlowTone,
} from "@/registry/ui/flow-diagram/flow-diagram"

// 前十个是内置色调；后两个是任意 CSS 颜色：color-mix 直接写，或先定义成变量再引用
const TONES: { name: string; tone: FlowTone }[] = [
  { name: "primary", tone: "primary" },
  { name: "foreground", tone: "foreground" },
  { name: "muted", tone: "muted" },
  { name: "destructive", tone: "destructive" },
  { name: "blue", tone: "blue" },
  { name: "green", tone: "green" },
  { name: "amber", tone: "amber" },
  { name: "rose", tone: "rose" },
  { name: "violet", tone: "violet" },
  { name: "cyan", tone: "cyan" },
  {
    name: "color-mix",
    tone: "color-mix(in oklab, var(--flow-blue) 50%, var(--flow-rose))",
  },
  { name: "--brand", tone: "var(--brand)" },
]

const COLUMNS = 4
const STEP = 0.2
const LAST_AT = 0.2 + (TONES.length - 1) * STEP

const REST = LAST_AT + 1
const EXIT = REST + 0.8
const DURATION = EXIT + 0.8

/** 色调一览：每个节点用一种色调点亮，最后两个是任意 CSS 颜色。 */
export default function FlowDiagramTonesDemo() {
  return (
    <FlowDiagram
      width={320}
      height={142}
      duration={DURATION}
      exit={EXIT}
      rest={REST}
      className="w-full max-w-md"
      // --brand 是自己定义的变量，tone 里直接引用它
      style={
        {
          "--brand":
            "color-mix(in oklab, var(--flow-green) 55%, var(--flow-cyan))",
        } as CSSProperties
      }
    >
      {TONES.map(({ name, tone }, index) => {
        const x = 37 + (index % COLUMNS) * 82
        const y = 26 + Math.floor(index / COLUMNS) * 38
        return (
          <FlowNode
            key={name}
            x={x}
            y={y}
            width={72}
            height={24}
            tone={tone}
            litAt={0.2 + index * STEP}
          >
            <FlowLabel x={x} y={y} tone={tone}>
              {name}
            </FlowLabel>
          </FlowNode>
        )
      })}
      <FlowReveal at={LAST_AT}>
        <FlowLabel x={160} y={128} tone="muted" className="text-[9px]">
          最后两个：任意 CSS 颜色
        </FlowLabel>
      </FlowReveal>
    </FlowDiagram>
  )
}
