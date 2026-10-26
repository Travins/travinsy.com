"use client"

import { motion, useTransform } from "motion/react"
import { FileText, Loader, Search, Sparkles, Wrench } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  FlowBeam,
  FlowDiagram,
  FlowLabel,
  FlowNode,
  FlowReveal,
  FlowTypedText,
  flowArrival,
  flowRoute,
  useFlowClock,
} from "@/registry/ui/flow-diagram/flow-diagram"

// 时间轴（秒）：来源汇入 → 逐字提问 → 思考 → 答案条目依次出现
const DURATION = 9
const EXIT = 8.2
const REST = 7.5

const QUESTION = "如何接入新的工具？"
const QUESTION_INTERVAL = 0.14
const SOURCES = [
  { x: 56, label: "文档", Icon: FileText },
  { x: 160, label: "工具", Icon: Wrench },
] as const
const ANSWERS = [
  { title: "在 tools/ 注册定义", tag: "文档" },
  { title: "挂载到 Agent 循环", tag: "工具" },
  { title: "运行并验证调用", tag: "结果" },
] as const

const FEED = SOURCES.map(({ x }) =>
  flowRoute([
    [x, 33],
    [x, 50],
    [108, 50],
    [108, 63],
  ]),
)
const FEED_AT = 0.4
const ASK_AT = flowArrival(FEED_AT, FEED[0]) + 0.35
const THINK_AT = ASK_AT + Array.from(QUESTION).length * QUESTION_INTERVAL + 0.15
const ANSWER_AT = THINK_AT + 1
const ROW_Y = [113, 140, 167]

/** 输入框右侧的状态图标：平时是星花，思考时换成旋转的加载环。 */
function Status() {
  const { time } = useFlowClock()
  const idle = useTransform(
    time,
    [THINK_AT - 0.15, THINK_AT, ANSWER_AT, ANSWER_AT + 0.2],
    [1, 0, 0, 1],
  )
  const busy = useTransform(
    time,
    [THINK_AT - 0.15, THINK_AT, ANSWER_AT, ANSWER_AT + 0.2],
    [0, 1, 1, 0],
  )
  const rotate = useTransform(time, (value) => value * 540)
  return (
    <>
      <motion.g style={{ opacity: idle }}>
        <Sparkles
          x={184}
          y={70}
          width={12}
          height={12}
          strokeWidth={1.5}
          className="text-muted-foreground"
        />
      </motion.g>
      <motion.g style={{ opacity: busy }}>
        <motion.g
          style={{
            rotate,
            transformBox: "fill-box",
            transformOrigin: "center",
          }}
        >
          <Loader
            x={184}
            y={70}
            width={12}
            height={12}
            strokeWidth={1.5}
            className="text-primary"
          />
        </motion.g>
      </motion.g>
    </>
  )
}

/** 提问之前的占位提示，开始打字时淡出，循环末尾再回来。 */
function Placeholder() {
  const { time, exit, duration } = useFlowClock()
  const opacity = useTransform(
    time,
    [ASK_AT - 0.2, ASK_AT - 0.05, exit, duration],
    [1, 0, 0, 1],
  )
  return (
    <motion.g style={{ opacity }}>
      <FlowLabel x={40} y={76} anchor="start" className="fill-muted-foreground">
        向 Agent 提问…
      </FlowLabel>
    </motion.g>
  )
}

/** AI 应用与 Agent：文档与工具两路来源汇入输入框，逐字提问后给出答案条目。 */
function FlowDiagramAgentDemo({ className }: { className?: string }) {
  return (
    <FlowDiagram
      className={cn("h-56 w-full max-w-md", className)}
      duration={DURATION}
      exit={EXIT}
      rest={REST}
    >
      {FEED.map((path, i) => (
        <FlowBeam key={`feed-${i}`} route={path} at={FEED_AT} />
      ))}

      {SOURCES.map(({ x, label, Icon }) => (
        <FlowNode key={label} x={x} y={22} width={64} height={22} litAt={0.2}>
          <Icon
            x={x - 24}
            y={16}
            width={12}
            height={12}
            strokeWidth={1.5}
            className="text-muted-foreground"
          />
          <FlowLabel x={x + 8} y={22}>
            {label}
          </FlowLabel>
        </FlowNode>
      ))}

      {/* 答案出现之前的骨架行 */}
      {ROW_Y.map((y) => (
        <g key={y}>
          <rect
            x={14}
            y={y - 11}
            width={188}
            height={22}
            rx={4}
            strokeWidth={1}
            className="stroke-foreground/10"
          />
          <rect
            x={22}
            y={y - 4}
            width={10}
            height={8}
            rx={2}
            className="fill-muted"
          />
          <rect
            x={44}
            y={y - 2}
            width={84}
            height={4}
            rx={2}
            className="fill-muted"
          />
          <rect
            x={172}
            y={y - 2}
            width={22}
            height={4}
            rx={2}
            className="fill-muted"
          />
        </g>
      ))}

      <FlowNode
        x={108}
        y={76}
        width={188}
        height={26}
        radius={5}
        litAt={flowArrival(FEED_AT, FEED[0])}
      >
        <Search
          x={22}
          y={70}
          width={12}
          height={12}
          strokeWidth={1.5}
          className="text-muted-foreground"
        />
        <Placeholder />
        <FlowTypedText
          text={QUESTION}
          at={ASK_AT}
          interval={QUESTION_INTERVAL}
          x={40}
          y={76}
        />
        <Status />
      </FlowNode>

      {ANSWERS.map(({ title, tag }, i) => (
        <FlowReveal key={title} at={ANSWER_AT + i * 0.25} rise={5}>
          <rect
            x={14}
            y={ROW_Y[i] - 11}
            width={188}
            height={22}
            rx={4}
            strokeWidth={1}
            className="fill-background stroke-foreground/30"
          />
          <FlowLabel
            x={24}
            y={ROW_Y[i]}
            anchor="start"
            className="fill-primary text-[9px]"
          >
            {String(i + 1).padStart(2, "0")}
          </FlowLabel>
          <FlowLabel x={44} y={ROW_Y[i]} anchor="start">
            {title}
          </FlowLabel>
          <FlowLabel
            x={194}
            y={ROW_Y[i]}
            anchor="end"
            className="fill-muted-foreground text-[9px]"
          >
            {tag}
          </FlowLabel>
        </FlowReveal>
      ))}
    </FlowDiagram>
  )
}

export default FlowDiagramAgentDemo
