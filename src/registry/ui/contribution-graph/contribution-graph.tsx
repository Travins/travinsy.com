"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type Contribution = { date: string; count: number; level: number }
const levels = [
  "bg-foreground/5",
  "bg-foreground/20",
  "bg-foreground/40",
  "bg-foreground/60",
  "bg-foreground/80",
]
const dayMilliseconds = 86_400_000
const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  timeZone: "UTC",
  year: "numeric",
  month: "long",
  day: "numeric",
})

/** 按真实日期排列的贡献日历；空缺日期不冒充零贡献，数据表提供非颜色读取方式。 */
export function ContributionGraph({
  data,
  className,
}: {
  /** 过去一年的每日记录，顺序任意；只绘制最后一天往前 365 天 */
  data: readonly Contribution[]
  className?: string
}) {
  const [activeDate, setActiveDate] = useState<string | null>(null)
  const { weeks, entries } = useMemo(() => {
    const valid = data
      .filter(
        (entry) =>
          /^\d{4}-\d{2}-\d{2}$/.test(entry.date) &&
          Number.isFinite(Date.parse(entry.date)),
      )
      .toSorted((a, b) => a.date.localeCompare(b.date))
    if (!valid.length) return { weeks: [], entries: [] }
    const end = Date.parse(valid[valid.length - 1].date)
    const start = end - 364 * dayMilliseconds
    const firstSunday = start - new Date(start).getUTCDay() * dayMilliseconds
    const entries = valid.filter((entry) => Date.parse(entry.date) >= start)
    const byDate = new Map(entries.map((entry) => [entry.date, entry]))
    const weeks: {
      date: string
      day: Contribution | undefined
      month: string | null
    }[][] = []
    for (let stamp = firstSunday; stamp <= end; stamp += dayMilliseconds) {
      const date = new Date(stamp).toISOString().slice(0, 10)
      const weekIndex = Math.floor(
        (stamp - firstSunday) / (7 * dayMilliseconds),
      )
      const day = new Date(stamp)
      if (!weeks[weekIndex]) weeks[weekIndex] = []
      weeks[weekIndex].push({
        date,
        day: byDate.get(date),
        month: day.getUTCDate() === 1 ? `${day.getUTCMonth() + 1}月` : null,
      })
    }
    return { weeks, entries }
  }, [data])

  if (!entries.length)
    return (
      <p className="py-8 font-mono text-xs leading-6 text-muted-foreground">
        贡献日历暂未更新。下次构建时会自动重试获取数据。
      </p>
    )
  return (
    <div className={cn("min-w-0", className)}>
      <div
        role="region"
        aria-label="过去一年的 GitHub 贡献日历，可横向滚动；方向键查看相邻日期"
        tabIndex={0}
        className="overflow-x-auto rounded-sm pb-2 focus-visible:outline-2 focus-visible:outline-ring"
      >
        <div className="flex w-max gap-2 font-mono text-[10px] text-muted-foreground">
          <div
            aria-hidden="true"
            className="grid grid-rows-[18px_repeat(7,10px)] gap-[3px]"
          >
            <span />
            <span />
            <span>一</span>
            <span />
            <span>三</span>
            <span />
            <span>五</span>
            <span />
          </div>
          <TooltipProvider delay={100}>
            <div className="flex gap-[3px]">
              {weeks.map((week) => (
                <div
                  key={week[0].date}
                  className="grid w-[10px] grid-rows-[18px_repeat(7,10px)] gap-[3px]"
                >
                  <span
                    aria-hidden="true"
                    className="relative whitespace-nowrap"
                  >
                    {week.find((entry) => entry.month)?.month}
                  </span>
                  {week.map(({ date, day }) =>
                    day ? (
                      <Tooltip key={date}>
                        <TooltipTrigger
                          render={<button type="button" />}
                          tabIndex={
                            activeDate === date ||
                            (!activeDate && date === entries[0].date)
                              ? 0
                              : -1
                          }
                          onFocus={() => setActiveDate(date)}
                          onKeyDown={(event) => {
                            const offsets: Record<string, number> = {
                              ArrowDown: 1,
                              ArrowUp: -1,
                              ArrowLeft: -7,
                              ArrowRight: 7,
                            }
                            if (!(event.key in offsets)) return
                            event.preventDefault()
                            const position = entries.findIndex(
                              (entry) => entry.date === date,
                            )
                            const next =
                              entries[
                                Math.max(
                                  0,
                                  Math.min(
                                    entries.length - 1,
                                    position + offsets[event.key],
                                  ),
                                )
                              ]
                            const region =
                              event.currentTarget.closest('[role="region"]')
                            region
                              ?.querySelector<HTMLButtonElement>(
                                `[data-date="${next.date}"]`,
                              )
                              ?.focus()
                          }}
                          data-date={date}
                          aria-label={`${dateFormatter.format(new Date(date))}：${day.count} 次贡献`}
                          className={cn(
                            "size-[10px] rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                            levels[
                              Math.max(0, Math.min(4, Math.floor(day.level)))
                            ] ?? levels[0],
                          )}
                        />
                        <TooltipContent>
                          {dateFormatter.format(new Date(date))} ·{" "}
                          {new Intl.NumberFormat("zh-CN").format(day.count)}{" "}
                          次贡献
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <span
                        key={date}
                        aria-hidden="true"
                        className="size-[10px]"
                      />
                    ),
                  )}
                </div>
              ))}
            </div>
          </TooltipProvider>
        </div>
      </div>
      <div
        aria-label="贡献数量由少到多"
        className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[10px] text-muted-foreground"
      >
        <span>少</span>
        {levels.map((level) => (
          <span
            key={level}
            aria-hidden="true"
            className={cn("size-2.5 rounded-[2px]", level)}
          />
        ))}
        <span>多</span>
      </div>
      <details className="mt-2 text-xs text-muted-foreground">
        <summary className="w-fit cursor-pointer rounded py-1 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">
          查看每日贡献数据
        </summary>
        <div className="mt-2 max-h-48 overflow-auto">
          <table className="w-full text-left font-mono tabular-nums">
            <caption className="sr-only">过去一年的每日贡献记录</caption>
            <thead>
              <tr>
                <th scope="col" className="py-2 font-normal">
                  日期
                </th>
                <th scope="col" className="py-2 text-right font-normal">
                  贡献次数
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((day) => (
                <tr key={day.date}>
                  <th scope="row" className="py-1 font-normal">
                    {day.date}
                  </th>
                  <td className="text-right">
                    {new Intl.NumberFormat("zh-CN").format(day.count)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}
