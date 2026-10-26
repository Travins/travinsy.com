import { Check, GitCommitHorizontal } from "lucide-react"

import {
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

const JOBS = [
  { y: 62, label: "lint", duration: 0.7 },
  { y: 138, label: "test", duration: 1.7 },
] as const

const TO_SPLIT = flowRoute([
  [64, 100],
  [82, 100],
])
const TO_JOBS = JOBS.map(({ y }) =>
  flowRoute([
    [88, y === 62 ? 94 : 106],
    [88, y],
    [112, y],
  ]),
)
const TO_MERGE = JOBS.map(({ y }) =>
  flowRoute([
    [172, y],
    [200, y],
    [200, y === 62 ? 94 : 106],
  ]),
)
const TO_BUILD = flowRoute([
  [206, 100],
  [226, 100],
])
const TO_DEPLOY = flowRoute([
  [254, 111],
  [254, 157],
])

// 时间轴（秒）：push → 并行跑 lint / test（耗时不同）→ 都通过后汇合 → build → deploy
const SPLIT_AT = 0.5
const JOBS_AT = flowArrival(SPLIT_AT, TO_SPLIT) + 0.15
const JOBS_START = flowArrival(JOBS_AT, TO_JOBS[0])
const JOBS_DONE = JOBS.map(({ duration }) => JOBS_START + duration)
// 先跑完的 job 先发光点，但汇合点要等最慢的那个
const MERGE_AT = JOBS_DONE.map((done) => done + 0.1)
const MERGED = Math.max(
  ...MERGE_AT.map((at, i) => flowArrival(at, TO_MERGE[i])),
)
const BUILD_AT = MERGED + 0.15
const BUILD_START = flowArrival(BUILD_AT, TO_BUILD)
const BUILD_DONE = BUILD_START + 1
const DEPLOY_AT = BUILD_DONE + 0.1
const LIVE_AT = flowArrival(DEPLOY_AT, TO_DEPLOY)

const REST = LIVE_AT + 0.6
const EXIT = REST + 0.8
const DURATION = EXIT + 0.8

/** 一个会转圈、完成后换成对勾的 job 状态。 */
function JobStatus({
  x,
  y,
  from,
  to,
}: {
  x: number
  y: number
  from: number
  to: number
}) {
  return (
    <>
      <FlowSpinner x={x} y={y} size={10} at={from} until={to} />
      <FlowReveal at={to}>
        <Check
          x={x - 6}
          y={y - 6}
          width={12}
          height={12}
          strokeWidth={2}
          className="text-primary"
        />
      </FlowReveal>
    </>
  )
}

/** CI/CD 流水线：push 之后 lint 与 test 并行，全部通过才进入 build 和 deploy。 */
export default function FlowDiagramCicdDemo() {
  return (
    <FlowDiagram
      width={320}
      height={200}
      duration={DURATION}
      exit={EXIT}
      rest={REST}
      className="w-full max-w-md"
    >
      <FlowBeam route={TO_SPLIT} at={SPLIT_AT} />
      {TO_JOBS.map((route, i) => (
        <FlowBeam key={`job-${i}`} route={route} at={JOBS_AT} />
      ))}
      {TO_MERGE.map((route, i) => (
        <FlowBeam key={`merge-${i}`} route={route} at={MERGE_AT[i]} />
      ))}
      <FlowBeam route={TO_BUILD} at={BUILD_AT} />
      <FlowBeam route={TO_DEPLOY} at={DEPLOY_AT} />

      <FlowNode x={38} y={100} width={52} litAt={0.2}>
        <GitCommitHorizontal
          x={19}
          y={94}
          width={12}
          height={12}
          strokeWidth={1.5}
          className="text-muted-foreground"
        />
        <FlowLabel x={48} y={100}>
          push
        </FlowLabel>
      </FlowNode>

      <FlowDiamond x={88} y={100} litAt={flowArrival(SPLIT_AT, TO_SPLIT)} />

      {JOBS.map(({ y, label }, i) => (
        <FlowNode key={label} x={142} y={y} width={60} litAt={JOBS_START}>
          <JobStatus x={124} y={y} from={JOBS_START} to={JOBS_DONE[i]} />
          <FlowLabel x={150} y={y}>
            {label}
          </FlowLabel>
        </FlowNode>
      ))}

      <FlowDiamond x={200} y={100} litAt={MERGED} />

      <FlowNode x={254} y={100} width={56} litAt={BUILD_START}>
        <JobStatus x={236} y={100} from={BUILD_START} to={BUILD_DONE} />
        <FlowLabel x={262} y={100}>
          build
        </FlowLabel>
      </FlowNode>

      <FlowNode x={254} y={170} width={72} litAt={LIVE_AT}>
        <FlowStatusDot x={232} y={170} at={LIVE_AT} pulse />
        <FlowLabel x={256} y={170}>
          deploy
        </FlowLabel>
      </FlowNode>
      <FlowReveal at={LIVE_AT}>
        <FlowLabel x={254} y={188} className="fill-muted-foreground text-[9px]">
          v1.4.2 · prod
        </FlowLabel>
      </FlowReveal>
    </FlowDiagram>
  )
}
