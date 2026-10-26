import {
  FLOW_BEAM_SPEED,
  FlowBeam,
  FlowDiagram,
  FlowDiamond,
  FlowLabel,
  FlowNode,
  FlowReveal,
  FlowSpinner,
  FlowStatusDot,
  flowArrival,
  flowRoute,
} from "@/registry/ui/flow-diagram/flow-diagram"

// 每项服务的耗时：动画里 40ms 对应 1 秒，慢的服务让汇合点多等一会儿
const SERVICES = [
  { y: 40, label: "用户服务", ms: 12 },
  { y: 110, label: "订单服务", ms: 64 },
  { y: 180, label: "库存服务", ms: 28 },
] as const
const MS_PER_SECOND = 40

const TO_SPLIT = flowRoute([
  [68, 110],
  [92, 110],
])
const FAN_OUT = SERVICES.map(({ y }) =>
  flowRoute(
    y === 110
      ? [
          [104, 110],
          [126, 110],
        ]
      : [
          [98, y === 40 ? 104 : 116],
          [98, y],
          [126, y],
        ],
  ),
)
const FAN_IN = SERVICES.map(({ y }) =>
  flowRoute(
    y === 110
      ? [
          [194, 110],
          [232, 110],
        ]
      : [
          [194, y],
          [238, y],
          [238, y === 40 ? 104 : 116],
        ],
  ),
)
const TO_REPLY = flowRoute([
  [244, 110],
  [256, 110],
])

// 时间轴（秒）：请求扇出，三条线同时到达；各服务按自己的耗时返回，汇合点等最慢的那个
const SPLIT_AT = 0.5
const ARRIVE = 1.9
// 长短不一的路径反推出发时刻，让三束光点同时到达
const FAN_OUT_AT = FAN_OUT.map(
  (route) => ARRIVE - route.length / FLOW_BEAM_SPEED,
)
const DONE_AT = SERVICES.map(({ ms }) => ARRIVE + ms / MS_PER_SECOND)
const MERGED = Math.max(...DONE_AT.map((at, i) => flowArrival(at, FAN_IN[i])))
const REPLY_AT = MERGED + 0.15
const REPLIED = flowArrival(REPLY_AT, TO_REPLY)
// 总耗时 = 最慢的服务 + 网关与汇合的 2ms 开销
const TOTAL = Math.max(...SERVICES.map(({ ms }) => ms)) + 2

const REST = REPLIED + 0.7
const EXIT = REST + 0.8
const DURATION = EXIT + 0.8

/** 微服务请求链路：网关扇出到多个服务并行处理，耗时各异，最后汇合成一个响应。 */
export default function FlowDiagramMicroserviceDemo() {
  return (
    <FlowDiagram
      width={320}
      height={220}
      duration={DURATION}
      exit={EXIT}
      rest={REST}
      className="w-full max-w-md"
    >
      <FlowBeam route={TO_SPLIT} at={SPLIT_AT} />
      {FAN_OUT.map((route, i) => (
        <FlowBeam key={`out-${i}`} route={route} at={FAN_OUT_AT[i]} />
      ))}
      {FAN_IN.map((route, i) => (
        <FlowBeam key={`in-${i}`} route={route} at={DONE_AT[i]} />
      ))}
      <FlowBeam route={TO_REPLY} at={REPLY_AT} />

      <FlowNode x={40} y={110} width={56} litAt={0.2}>
        <FlowLabel x={40} y={110}>
          网关
        </FlowLabel>
      </FlowNode>
      <FlowDiamond x={98} y={110} litAt={flowArrival(SPLIT_AT, TO_SPLIT)} />

      {SERVICES.map(({ y, label, ms }, i) => (
        <g key={label}>
          <FlowNode x={160} y={y} width={68} litAt={ARRIVE}>
            <FlowSpinner
              x={138}
              y={y}
              size={9}
              at={ARRIVE}
              until={DONE_AT[i]}
            />
            <FlowStatusDot x={138} y={y} at={DONE_AT[i]} />
            <FlowLabel x={165} y={y}>
              {label}
            </FlowLabel>
          </FlowNode>
          <FlowReveal at={DONE_AT[i]}>
            <FlowLabel
              x={213}
              y={y - 9}
              className="fill-muted-foreground text-[9px]"
            >
              {ms}ms
            </FlowLabel>
          </FlowReveal>
        </g>
      ))}

      <FlowDiamond x={238} y={110} litAt={MERGED} />
      <FlowNode x={284} y={110} width={56} litAt={REPLIED}>
        <FlowLabel x={284} y={110}>
          响应
        </FlowLabel>
      </FlowNode>
      <FlowReveal at={REPLIED}>
        <FlowLabel x={284} y={130} className="fill-primary text-[9px]">
          {TOTAL}ms
        </FlowLabel>
      </FlowReveal>
    </FlowDiagram>
  )
}
