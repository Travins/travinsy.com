"use client"

import { useEffect, useState } from "react"
import { Moon, Sun, Sunrise, Sunset, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Greeting } from "@/registry/ui/greeting/greeting"

// 与 Greeting 的时段划分一致：05–11 早上、11–14 中午、14–18 下午、其余晚上。
const PERIODS: readonly {
  label: string
  en: string
  range: string
  icon: LucideIcon
  from: number
  to: number
}[] = [
  {
    label: "早上",
    en: "Morning",
    range: "05–11",
    icon: Sunrise,
    from: 5,
    to: 11,
  },
  { label: "中午", en: "Noon", range: "11–14", icon: Sun, from: 11, to: 14 },
  {
    label: "下午",
    en: "Afternoon",
    range: "14–18",
    icon: Sunset,
    from: 14,
    to: 18,
  },
  {
    label: "晚上",
    en: "Evening",
    range: "18–05",
    icon: Moon,
    from: 18,
    to: 29,
  },
]

/** 当前小时落在哪个时段；挂载前为 -1，静态首屏不高亮任何一格。 */
function useActivePeriod() {
  const [index, setIndex] = useState(-1)
  useEffect(() => {
    const update = () => {
      const hour = new Date().getHours()
      const shifted = hour < 5 ? hour + 24 : hour
      setIndex(PERIODS.findIndex((p) => shifted >= p.from && shifted < p.to))
    }
    const first = window.setTimeout(update, 0)
    const timer = window.setInterval(update, 60_000)
    return () => {
      window.clearTimeout(first)
      window.clearInterval(timer)
    }
  }, [])
  return index
}

/**
 * 时段问候封面：大字问候语 + 四个时段格，当前时段亮起主色。
 * 问候语由组件按访客本地时间决定，时段格只是帮助读懂它的规则。
 */
export default function GreetingShowcaseDemo() {
  const active = useActivePeriod()

  return (
    <div className="relative flex size-full items-center justify-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-hatch [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)] opacity-60"
      />
      <div className="relative flex w-[min(100%-2rem,22rem)] flex-col gap-5">
        <div>
          <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground">
            GREETING /{" "}
            {active < 0 ? "LOCAL TIME" : PERIODS[active].en.toUpperCase()}
          </p>
          <p className="mt-2 text-4xl font-semibold tracking-tight">
            <Greeting suffix="" />
            <span className="text-primary">.</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            <Greeting fallback="你好" suffix="，很高兴在这里遇见你。" />
          </p>
        </div>
        <ol className="grid grid-cols-4 gap-1.5" aria-hidden="true">
          {PERIODS.map(({ label, range, icon: Icon }, index) => (
            <li
              key={label}
              data-active={index === active ? "" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 rounded-md border border-edge bg-background px-1 py-2 text-muted-foreground transition-colors",
                "data-[active]:border-primary/50 data-[active]:bg-primary/10 data-[active]:text-primary",
              )}
            >
              <Icon className="size-4" strokeWidth={1.5} />
              <span className="text-xs">{label}</span>
              <span className="font-mono text-[10px] opacity-70">{range}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
