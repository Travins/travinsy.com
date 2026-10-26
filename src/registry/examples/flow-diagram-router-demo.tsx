import {
  FlowBeam,
  FlowDiagram,
  FlowEdge,
  FlowNode,
  FlowSpinner,
  FlowStatusDot,
  flowArrival,
  flowRoute,
} from "@/registry/ui/flow-diagram/flow-diagram"

// 每个模型一种颜色：请求被路由到谁，光点、连线和节点就是谁的颜色
const MODELS = [
  { y: 36, label: "轻量模型", description: "简单问答", tone: "cyan" },
  { y: 100, label: "推理模型", description: "复杂推理", tone: "violet" },
  { y: 164, label: "长文本模型", description: "超长文档", tone: "amber" },
] as const

const TO_ROUTER = flowRoute([
  [72, 100],
  [112, 100],
])
const TO_MODELS = MODELS.map(({ y }) =>
  flowRoute(
    y === 100
      ? [
          [176, 100],
          [212, 100],
        ]
      : [
          [176, y === 36 ? 90 : 110],
          [194, y === 36 ? 90 : 110],
          [194, y],
          [212, y],
        ],
  ),
)

// 时间轴（秒）：三个请求依次进来，每个被路由到不同的模型，模型处理完亮起状态点
const ROUND = 1.7
const PROCESS = 0.7
const REQUEST_AT = MODELS.map((_, i) => 0.5 + i * ROUND)
const ROUTED_AT = REQUEST_AT.map((at) => flowArrival(at, TO_ROUTER) + 0.2)
const ARRIVE_AT = ROUTED_AT.map((at, i) => flowArrival(at, TO_MODELS[i]))
const DONE_AT = ARRIVE_AT.map((at) => at + PROCESS)

const REST = DONE_AT[MODELS.length - 1] + 0.8
const EXIT = REST + 0.8
const DURATION = EXIT + 0.8

/** 多模型路由：请求经路由器分流到不同的模型，每个模型一种颜色。 */
export default function FlowDiagramRouterDemo() {
  return (
    <FlowDiagram
      background={
        // 自定义底纹：中心一圈淡紫，呼应路由到的多个模型
        <div className="size-full bg-radial from-(--flow-violet)/12 to-transparent to-70%" />
      }
      width={320}
      height={200}
      duration={DURATION}
      exit={EXIT}
      rest={REST}
      className="w-full max-w-md"
    >
      {/* 入口的线只画一次，三个请求的光点都走这条线，所以光点都不带底线 */}
      <FlowEdge route={TO_ROUTER} at={0.1} />
      {MODELS.map(({ tone }, i) => (
        <FlowBeam
          key={`request-${i}`}
          route={TO_ROUTER}
          at={REQUEST_AT[i]}
          base={false}
          tone={tone}
        />
      ))}
      {/* 路由器到各模型的连线是常驻的，光点沿着它们走 */}
      {MODELS.map(({ tone }, i) => (
        <FlowBeam
          key={`route-${i}`}
          route={TO_MODELS[i]}
          at={ROUTED_AT[i]}
          tone={tone}
        />
      ))}

      <FlowNode x={40} y={100} width={64} litAt={0.2} label="请求" />
      <FlowNode
        x={144}
        y={100}
        width={64}
        height={36}
        shape="box"
        litAt={ROUTED_AT[0]}
        label="路由"
        description="按任务分流"
      />

      {MODELS.map(({ y, label, description, tone }, i) => (
        <FlowNode
          key={label}
          x={266}
          y={y}
          width={92}
          height={34}
          shape="box"
          tone={tone}
          litAt={ARRIVE_AT[i]}
          label={label}
          description={description}
        >
          {/* 处理中转圈，处理完换成状态点；两者都继承节点的颜色 */}
          <FlowSpinner
            x={230}
            y={y}
            size={10}
            at={ARRIVE_AT[i]}
            until={DONE_AT[i]}
          />
          <FlowStatusDot x={230} y={y} at={DONE_AT[i]} />
        </FlowNode>
      ))}
    </FlowDiagram>
  )
}
