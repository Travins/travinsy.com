import {
  FlowBeam,
  FlowDiagram,
  FlowNode,
  flowArrival,
  flowRoute,
} from "@/registry/ui/flow-diagram/flow-diagram"

// 时间轴（秒）：A 点亮 → 光点飞向 B → B 点亮 → 光点飞向 C → C 点亮
const TO_PROCESS = flowRoute([
  [80, 50],
  [130, 50],
])
const TO_OUTPUT = flowRoute([
  [190, 50],
  [240, 50],
])

const FIRST_AT = 0.5
const PROCESS_AT = flowArrival(FIRST_AT, TO_PROCESS)
const SECOND_AT = PROCESS_AT + 0.2
const OUTPUT_AT = flowArrival(SECOND_AT, TO_OUTPUT)

// 静帧停在所有节点都点亮之后；整轮 4.4 秒，3.6 秒起淡出
const DURATION = 4.4
const EXIT = 3.6
const REST = 3.4

export default function FlowDiagramDemo() {
  return (
    <FlowDiagram
      background="grid"
      width={320}
      height={100}
      duration={DURATION}
      exit={EXIT}
      rest={REST}
      className="w-full max-w-md"
    >
      <FlowBeam route={TO_PROCESS} at={FIRST_AT} />
      <FlowBeam route={TO_OUTPUT} at={SECOND_AT} />

      <FlowNode x={50} y={50} width={60} litAt={0.2} label="输入" />
      <FlowNode x={160} y={50} width={60} litAt={PROCESS_AT} label="处理" />
      <FlowNode x={270} y={50} width={60} litAt={OUTPUT_AT} label="输出" />
    </FlowDiagram>
  )
}
