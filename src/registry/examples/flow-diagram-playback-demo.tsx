"use client"

import { useState } from "react"
import { Pause, Play, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  FlowBeam,
  FlowDiagram,
  FlowNode,
  flowArrival,
  flowRoute,
} from "@/registry/ui/flow-diagram/flow-diagram"

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

const DURATION = 4.4
const EXIT = 3.6
const REST = 3.4

/** 播放控制：暂停 / 继续、倍速、是否循环；单次播放结束后停在静帧，点“重播”再来一遍。 */
export default function FlowDiagramPlaybackDemo() {
  const [paused, setPaused] = useState(false)
  const [fast, setFast] = useState(false)
  const [loop, setLoop] = useState(true)
  const [round, setRound] = useState(0)

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <FlowDiagram
        // 换 key 会重新挂载，时钟回到初始状态，单次播放就会重新开始
        key={round}
        width={320}
        height={100}
        duration={DURATION}
        exit={EXIT}
        rest={REST}
        paused={paused}
        speed={fast ? 2 : 1}
        loop={loop}
        trigger="always"
        className="w-full"
      >
        <FlowBeam route={TO_PROCESS} at={FIRST_AT} />
        <FlowBeam route={TO_OUTPUT} at={SECOND_AT} />
        <FlowNode x={50} y={50} width={60} litAt={0.2} label="输入" />
        <FlowNode x={160} y={50} width={60} litAt={PROCESS_AT} label="处理" />
        <FlowNode x={270} y={50} width={60} litAt={OUTPUT_AT} label="输出" />
      </FlowDiagram>
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? <Play /> : <Pause />}
          {paused ? "继续" : "暂停"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          aria-pressed={fast}
          onClick={() => setFast((value) => !value)}
        >
          {fast ? "2× 速" : "1× 速"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          aria-pressed={loop}
          onClick={() => setLoop((value) => !value)}
        >
          {loop ? "循环" : "单次"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRound((value) => value + 1)}
        >
          <RotateCcw />
          重播
        </Button>
      </div>
    </div>
  )
}
