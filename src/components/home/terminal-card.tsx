"use client"

import { useReducedMotion } from "motion/react"
import { useEffect, useState } from "react"

import { GridCrosshair } from "@/registry/ui/grid-layout/grid-layout"

type TerminalStep = {
  command: string
  output: readonly string[]
}

const TICK_MS = 42
/** 开场停顿、命令敲完到输出、输出到下一条命令，都以 tick 计 */
const START_DELAY = 10
const PAUSE_AFTER_COMMAND = 8
const PAUSE_AFTER_OUTPUT = 12

type Frame = {
  command: string
  output: readonly string[]
  /** 光标是否停在这一行的命令末尾 */
  active: boolean
}

function totalTicks(steps: readonly TerminalStep[]) {
  return steps.reduce(
    (sum, step) =>
      sum + step.command.length + PAUSE_AFTER_COMMAND + PAUSE_AFTER_OUTPUT,
    0,
  )
}

/** 由 tick 计算当前可见的内容：纯函数，渲染期间不依赖时间或随机数。 */
function framesAt(steps: readonly TerminalStep[], tick: number): Frame[] {
  const frames: Frame[] = []
  let rest = Math.max(0, tick)
  for (const step of steps) {
    const typed = Math.min(rest, step.command.length)
    rest -= step.command.length
    if (rest < 0) {
      frames.push({
        command: step.command.slice(0, typed),
        output: [],
        active: true,
      })
      return frames
    }
    rest -= PAUSE_AFTER_COMMAND
    if (rest < 0) {
      frames.push({ command: step.command, output: [], active: true })
      return frames
    }
    rest -= PAUSE_AFTER_OUTPUT
    frames.push({ command: step.command, output: step.output, active: false })
    if (rest < 0) return frames
  }
  // 全部播完：停在一个空提示符上闪烁
  frames.push({ command: "", output: [], active: true })
  return frames
}

function Caret() {
  return (
    <span
      aria-hidden="true"
      className="ml-px inline-block h-[1.15em] w-[0.55em] translate-y-[0.2em] animate-caret bg-primary motion-reduce:animate-none"
    />
  )
}

function Lines({ frames }: { frames: Frame[] }) {
  return (
    <div className="flex flex-col">
      {frames.map((frame, index) => (
        <div key={index}>
          <p className="break-words whitespace-pre-wrap">
            <span className="text-primary select-none">$ </span>
            {frame.command}
            {frame.active ? <Caret /> : null}
          </p>
          {frame.output.map((line) => (
            <p
              key={line}
              className="break-words whitespace-pre-wrap text-muted-foreground"
            >
              {line}
            </p>
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * 等宽字体的终端卡片：逐字敲出命令，再显示输出。
 * 尊重 prefers-reduced-motion（直接显示全部）；先用不可见的完整内容占位，避免打字时高度跳动。
 */
function TerminalCard({
  title,
  steps,
}: {
  title: string
  steps: readonly TerminalStep[]
}) {
  const reducedMotion = useReducedMotion()
  const total = totalTicks(steps)
  const [tick, setTick] = useState(-START_DELAY)
  const done = tick >= total

  useEffect(() => {
    if (reducedMotion || done) return
    const timer = window.setInterval(
      () => setTick((value) => Math.min(value + 1, total)),
      TICK_MS,
    )
    return () => window.clearInterval(timer)
  }, [done, reducedMotion, total])

  const frames = framesAt(steps, reducedMotion ? total : tick)
  const transcript = steps
    .map((step) => `$ ${step.command}：${step.output.join(" ")}`)
    .join("；")

  return (
    <div
      data-slot="terminal-card"
      className="relative w-full max-w-md border border-edge bg-background"
    >
      <GridCrosshair position="top-left" />
      <GridCrosshair position="top-right" />
      <GridCrosshair position="bottom-left" />
      <GridCrosshair position="bottom-right" />
      <div
        aria-hidden="true"
        className="flex items-center justify-between border-b border-edge px-3 py-2 font-mono text-[11px] text-muted-foreground"
      >
        <span>{title}</span>
        <span>zsh</span>
      </div>
      <p className="sr-only">{transcript}</p>
      <div
        aria-hidden="true"
        className="grid px-4 py-4 font-mono text-xs leading-6 sm:text-[13px]"
      >
        <div className="invisible col-start-1 row-start-1">
          <Lines frames={framesAt(steps, total)} />
        </div>
        <div className="col-start-1 row-start-1">
          <Lines frames={frames} />
        </div>
      </div>
    </div>
  )
}

export { TerminalCard }
export type { TerminalStep }
