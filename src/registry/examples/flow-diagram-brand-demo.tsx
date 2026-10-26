import { GitCommitHorizontal } from "lucide-react"

import {
  FlowBeam,
  FlowDiagram,
  FlowLabel,
  FlowNode,
  FlowSpinner,
  FlowStatusDot,
  flowArrival,
  flowRoute,
} from "@/registry/ui/flow-diagram/flow-diagram"

// 品牌色：任意 CSS 颜色都行（十六进制、oklch、变量……），这里用主题变量混出一个
const BRAND = "color-mix(in oklab, var(--flow-blue) 55%, var(--flow-green))"

const TO_BUILD = flowRoute([
  [90, 45],
  [120, 45],
])
const TO_SHIP = flowRoute([
  [200, 45],
  [230, 45],
])

// 时间轴（秒）：提交 → 构建（转圈）→ 发布（状态点涟漪）
const PUSH_AT = 0.5
const BUILD_AT = flowArrival(PUSH_AT, TO_BUILD)
const BUILD_END = BUILD_AT + 1
const SHIP_AT = BUILD_END + 0.1
const LIVE_AT = flowArrival(SHIP_AT, TO_SHIP)

const REST = LIVE_AT + 0.8
const EXIT = REST + 0.8
const DURATION = EXIT + 0.8

/** 品牌色：只在 FlowDiagram 上设一次 tone，里面的节点、光点、加载圈和状态点都继承它。 */
export default function FlowDiagramBrandDemo() {
  return (
    <FlowDiagram
      background="hatch"
      width={320}
      height={90}
      duration={DURATION}
      exit={EXIT}
      rest={REST}
      tone={BRAND}
      className="w-full max-w-md"
    >
      <FlowBeam route={TO_BUILD} at={PUSH_AT} />
      <FlowBeam route={TO_SHIP} at={SHIP_AT} />

      <FlowNode
        x={50}
        y={45}
        width={72}
        litAt={0.2}
        icon={GitCommitHorizontal}
        label="提交"
      />
      <FlowNode x={160} y={45} width={72} litAt={BUILD_AT}>
        <FlowSpinner x={136} y={45} size={10} at={BUILD_AT} until={BUILD_END} />
        <FlowLabel x={166} y={45}>
          构建
        </FlowLabel>
      </FlowNode>
      <FlowNode x={270} y={45} width={72} litAt={LIVE_AT}>
        <FlowStatusDot x={246} y={45} at={LIVE_AT} pulse />
        <FlowLabel x={276} y={45}>
          发布
        </FlowLabel>
      </FlowNode>
    </FlowDiagram>
  )
}
