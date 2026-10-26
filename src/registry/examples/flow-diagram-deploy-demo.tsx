"use client"

import { Fragment } from "react"

import { cn } from "@/lib/utils"
import {
  FlowBeam,
  FlowDiagram,
  FlowLabel,
  FlowNode,
  FlowStatusDot,
  flowArrival,
  flowRoute,
} from "@/registry/ui/flow-diagram/flow-diagram"

// 时间轴（秒）：两轮请求先后流过；REST 落在最后一束光点之后、淡出之前
const DURATION = 7.2
const EXIT = 6.4
const REST = 6.3
const ROUNDS = [
  { intake: 0.4, dispatch: 1.7 },
  { intake: 3.6, dispatch: 4.9 },
] as const

const MODELS = [
  { x: 56, label: "Qwen3" },
  { x: 160, label: "DeepSeek" },
] as const
const TARGETS = [
  { x: 36, label: "API" },
  { x: 108, label: "Chat" },
  { x: 180, label: "Agent" },
] as const

// 模型 → 推理引擎：先下行，再在 y=56 汇到中线
const INTAKE = MODELS.map(({ x }) =>
  flowRoute([
    [x, 34],
    [x, 56],
    [108, 56],
    [108, 76],
  ]),
)
// 推理引擎 → 三个出口：中间直下，两侧先下到 y=132 再横向分开
const DISPATCH = TARGETS.map(({ x }) =>
  flowRoute(
    x === 108
      ? [
          [108, 110],
          [108, 158],
        ]
      : [
          [108, 110],
          [108, 132],
          [x, 132],
          [x, 158],
        ],
  ),
)

/** 大模型部署：模型汇入推理引擎，再分发到 API / Chat / Agent。 */
function FlowDiagramDeployDemo({ className }: { className?: string }) {
  const engineLit = flowArrival(ROUNDS[0].intake, INTAKE[0])

  return (
    <FlowDiagram
      className={cn("h-56 w-full max-w-md", className)}
      duration={DURATION}
      exit={EXIT}
      rest={REST}
    >
      {ROUNDS.map((round, index) => (
        <Fragment key={round.intake}>
          {INTAKE.map((path, i) => (
            <FlowBeam
              key={`in-${i}`}
              route={path}
              at={round.intake}
              base={index === 0}
            />
          ))}
          {DISPATCH.map((path, i) => (
            <FlowBeam
              key={`out-${i}`}
              route={path}
              at={round.dispatch}
              base={index === 0}
            />
          ))}
        </Fragment>
      ))}

      {MODELS.map(({ x, label }) => (
        <FlowNode key={label} x={x} y={24} width={72} litAt={0.2}>
          <FlowLabel x={x} y={24}>
            {label}
          </FlowLabel>
        </FlowNode>
      ))}

      <FlowNode
        x={108}
        y={93}
        width={116}
        height={34}
        radius={5}
        litAt={engineLit}
      >
        <FlowLabel x={108} y={88}>
          vLLM / SGLang
        </FlowLabel>
        <FlowLabel x={108} y={100} className="fill-muted-foreground text-[9px]">
          推理引擎
        </FlowLabel>
      </FlowNode>

      {TARGETS.map(({ x, label }, i) => {
        const arrival = flowArrival(ROUNDS[0].dispatch, DISPATCH[i])
        return (
          <FlowNode key={label} x={x} y={168} width={52} litAt={arrival}>
            {/* 服务就绪后，胶囊左侧亮起一个状态点 */}
            <FlowStatusDot x={x - 18} y={168} at={arrival} />
            <FlowLabel x={x + 3} y={168}>
              {label}
            </FlowLabel>
          </FlowNode>
        )
      })}
    </FlowDiagram>
  )
}

export default FlowDiagramDeployDemo
