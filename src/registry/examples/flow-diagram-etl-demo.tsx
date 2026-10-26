"use client"

import { motion, useTransform } from "motion/react"
import { Database, Globe, ScrollText } from "lucide-react"

import {
  FlowBeam,
  FlowDiagram,
  FlowLabel,
  FlowNode,
  FlowReveal,
  FlowStatusDot,
  flowArrival,
  flowRoute,
  useFlowClock,
} from "@/registry/ui/flow-diagram/flow-diagram"

const SOURCES = [
  { x: 48, label: "MySQL", Icon: Database },
  { x: 130, label: "日志", Icon: ScrollText },
  { x: 212, label: "API", Icon: Globe },
] as const
const BARS = [10, 16, 12, 22, 18] as const

const TO_CLEAN = SOURCES.map(({ x }) =>
  flowRoute(
    x === 130
      ? [
          [130, 34],
          [130, 68],
        ]
      : [
          [x, 34],
          [x, 52],
          [130, 52],
          [130, 68],
        ],
  ),
)
const TO_STORE = flowRoute([
  [130, 102],
  [130, 128],
])
const TO_BOARD = flowRoute([
  [130, 160],
  [130, 184],
])

// 时间轴（秒）：多源汇入 → 清洗（进度条走完）→ 入仓 → 看板的柱子依次长出来
const INTAKE_AT = 0.5
const CLEAN_AT = flowArrival(INTAKE_AT, TO_CLEAN[0])
const CLEAN_END = CLEAN_AT + 1.4
const STORE_AT = CLEAN_END + 0.1
const WAREHOUSE_AT = flowArrival(STORE_AT, TO_STORE)
const BOARD_AT = WAREHOUSE_AT + 0.2
const DASHBOARD_AT = flowArrival(BOARD_AT, TO_BOARD)
const GROW_START = DASHBOARD_AT + 0.1
const GROW_STEP = 0.12
const GROW_END = GROW_START + (BARS.length - 1) * GROW_STEP + 0.4

const REST = GROW_END + 0.6
const EXIT = REST + 0.8
const DURATION = EXIT + 0.8

/** 清洗节点里的进度条，宽度随时间轴从 0 涨到满。 */
function CleanProgress() {
  const { time, exit, duration } = useFlowClock()
  const scaleX = useTransform(time, [CLEAN_AT, CLEAN_END], [0, 1])
  const opacity = useTransform(time, [exit, duration], [1, 0])
  return (
    <motion.g style={{ opacity }}>
      <rect
        x={80}
        y={92}
        width={100}
        height={3}
        rx={1.5}
        className="fill-muted"
      />
      <motion.rect
        x={80}
        y={92}
        width={100}
        height={3}
        rx={1.5}
        className="fill-primary"
        style={{ scaleX, transformBox: "fill-box", transformOrigin: "left" }}
      />
    </motion.g>
  )
}

/** 看板里的柱子，从底边向上长出来。 */
function GrowingBar({
  x,
  height,
  index,
}: {
  x: number
  height: number
  index: number
}) {
  const { time } = useFlowClock()
  const start = GROW_START + index * GROW_STEP
  const scaleY = useTransform(time, [start, start + 0.4], [0, 1])
  return (
    <motion.rect
      x={x}
      y={218 - height}
      width={6}
      height={height}
      rx={1}
      className="fill-primary"
      style={{ scaleY, transformBox: "fill-box", transformOrigin: "bottom" }}
    />
  )
}

/** 数据管道 ETL：多个数据源汇入清洗，写入数仓，最后在看板上长出图表。 */
export default function FlowDiagramEtlDemo() {
  return (
    <FlowDiagram
      width={260}
      height={236}
      duration={DURATION}
      exit={EXIT}
      rest={REST}
      className="w-full max-w-sm"
    >
      {TO_CLEAN.map((route, i) => (
        // 数据源是常驻的接入：线画好后持续流动，直到清洗完成
        <FlowBeam key={`intake-${i}`} route={route} at={INTAKE_AT} flow />
      ))}
      <FlowBeam route={TO_STORE} at={STORE_AT} />
      <FlowBeam route={TO_BOARD} at={BOARD_AT} />

      {SOURCES.map(({ x, label, Icon }) => (
        <FlowNode key={label} x={x} y={24} width={72} litAt={0.2}>
          <Icon
            x={x - 28}
            y={18}
            width={12}
            height={12}
            strokeWidth={1.5}
            className="text-muted-foreground"
          />
          <FlowLabel x={x + 8} y={24}>
            {label}
          </FlowLabel>
        </FlowNode>
      ))}

      <FlowNode
        x={130}
        y={85}
        width={140}
        height={34}
        radius={5}
        litAt={CLEAN_AT}
      >
        <FlowLabel x={130} y={77}>
          清洗 / 去重
        </FlowLabel>
        <CleanProgress />
      </FlowNode>

      <FlowNode
        x={130}
        y={144}
        width={140}
        height={32}
        radius={5}
        litAt={WAREHOUSE_AT}
      >
        <FlowLabel x={130} y={139}>
          数据仓库
        </FlowLabel>
        <FlowLabel x={130} y={151} className="fill-muted-foreground text-[9px]">
          ClickHouse
        </FlowLabel>
        <FlowStatusDot x={74} y={144} at={WAREHOUSE_AT} pulse />
      </FlowNode>

      <FlowNode
        x={130}
        y={204}
        width={188}
        height={40}
        radius={5}
        litAt={DASHBOARD_AT}
      >
        <FlowLabel x={48} y={204} anchor="start">
          看板
        </FlowLabel>
        {BARS.map((height, index) => (
          <GrowingBar
            key={index}
            x={104 + index * 12}
            height={height}
            index={index}
          />
        ))}
        <FlowReveal at={GROW_END - 0.3}>
          <FlowLabel
            x={196}
            y={204}
            anchor="end"
            className="fill-primary text-[9px]"
          >
            +12%
          </FlowLabel>
        </FlowReveal>
      </FlowNode>
    </FlowDiagram>
  )
}
