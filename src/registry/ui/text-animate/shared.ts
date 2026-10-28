"use client"

import * as React from "react"
import { useInView } from "motion/react"

import type { FlowToneName } from "@/registry/ui/flow-diagram/tone"

import type { TextScrambleCharset } from "./text-scramble"

/** 各文字原语回报自己负责的属性，同一子树按属性保留第一个示例值。 */
type TextAnimateReport = Partial<{
  interval: number
  paused: boolean
  by: "char" | "word"
  stagger: number
  duration: number
  // 用顶层 import type：shadcn CLI 安装时只改写静态 import 的路径，内联 import() 类型里的别名不会被改写
  charset: TextScrambleCharset
  tone: FlowToneName
}>
type TextAnimateTuning = TextAnimateReport & {
  /** 回报覆盖前的示例取值。 */
  onReport?: (report: TextAnimateReport) => void
}
const TextAnimateTuningContext = React.createContext<TextAnimateTuning>({})
const reports = new WeakMap<
  NonNullable<TextAnimateTuning["onReport"]>,
  TextAnimateReport
>()

function useTextTuning(report: TextAnimateReport) {
  const tuning = React.useContext(TextAnimateTuningContext)
  const { onReport } = tuning
  // 效果按原语的属性订阅；不因 Provider 的新对象重复回报。
  const { interval, paused, by, stagger, duration, charset, tone } = report
  React.useEffect(() => {
    if (!onReport) return
    const previous = reports.get(onReport)
    const next = Object.fromEntries(
      Object.entries({
        interval,
        paused,
        by,
        stagger,
        duration,
        charset,
        tone,
      }).filter(([, value]) => value !== undefined),
    )
    reports.set(onReport, { ...next, ...previous })
    if (!previous) {
      // 等四种原语的 effect 都执行后再汇总，兼容面板只接收首次回报。
      queueMicrotask(() => {
        const collected = reports.get(onReport) ?? {}
        reports.delete(onReport)
        onReport(collected)
      })
    }
  }, [onReport, interval, paused, by, stagger, duration, charset, tone])
  return tuning
}

function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)")
  media.addEventListener("change", callback)
  return () => media.removeEventListener("change", callback)
}
function snapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}
function serverSnapshot() {
  return true
}
function useTextMotion() {
  return React.useSyncExternalStore(subscribe, snapshot, serverSnapshot)
}

function useTextEntrance(trigger: "mount" | "in-view") {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const reduced = useTextMotion()
  return { ref, active: !reduced && (trigger === "mount" || inView), reduced }
}

// 不能出现在行首的标点：每个片段都是 inline-block，浏览器的禁则不再生效，
// 所以把它们并进前一个片段，避免「。」孤零零掉到下一行
const NO_LINE_START = /^[，。、；：！？）」』》”’…·.,;:!?)\]}]+$/u

function segmentText(
  text: string,
  by: "char" | "word",
  locale = "zh-CN",
  /** 把行首禁则标点并进前一个片段，只有每个片段都是 inline-block 时才需要 */
  glue = false,
) {
  const parts: string[] = []
  for (const { segment } of new Intl.Segmenter(locale, {
    granularity: by === "char" ? "grapheme" : "word",
  }).segment(text)) {
    if (glue && parts.length && NO_LINE_START.test(segment)) {
      parts[parts.length - 1] += segment
    } else {
      parts.push(segment)
    }
  }
  return parts
}

const TEXT_CSS = `
@keyframes tv-text-reveal { from { opacity:0; filter:blur(6px); transform:translateY(.35em) } to { opacity:1; filter:blur(0); transform:translateY(0) } }
@keyframes tv-text-sweep { from { background-size:0% 100% } to { background-size:100% 100% } }
@media(prefers-reduced-motion:no-preference) {
 [data-slot="text-reveal"][data-active="true"] [data-slot="text-reveal-part"] { animation:tv-text-reveal .5s both; animation-delay:var(--text-delay) }
 [data-slot="text-highlight"][data-active="true"] { animation:tv-text-sweep .65s both }
}
[data-slot="text-highlight"] { background-image:linear-gradient(color-mix(in oklch,var(--text-tone) 22%,transparent),color-mix(in oklch,var(--text-tone) 22%,transparent)); background-repeat:no-repeat; background-position:0 100%; box-decoration-break:clone; -webkit-box-decoration-break:clone }
[data-slot="text-highlight"][data-variant="underline"] { background-image:linear-gradient(var(--text-tone),var(--text-tone)); background-origin:content-box; background-size:100% .09em }
@keyframes tv-text-underline { from { background-size:0% .09em } to { background-size:100% .09em } }
@media(prefers-reduced-motion:no-preference) { [data-slot="text-highlight"][data-active="true"][data-variant="underline"] { animation-name:tv-text-underline } }
@media(prefers-reduced-motion:reduce) {
 [data-slot="text-scramble-final"] { visibility:visible!important }
 [data-slot="text-scramble-noise"] { display:none }
}`

function textStyles() {
  return React.createElement(
    "style",
    { href: "travinsy-text-animate", precedence: "default" },
    TEXT_CSS,
  )
}

export {
  TextAnimateTuningContext,
  useTextTuning,
  useTextMotion,
  useTextEntrance,
  segmentText,
  textStyles,
}

export type { TextAnimateTuning, TextAnimateReport }
