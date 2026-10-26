"use client"

import { useMemo, useState } from "react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const levels = [
  "bg-foreground/5",
  "bg-foreground/20",
  "bg-foreground/40",
  "bg-foreground/60",
  "bg-foreground/80",
]
const dayMilliseconds = 86_400_000
// 星期表头只标注一、三、五，保持与方块行错位的斑马排布。
const weekdayRows = [1, 3, 5]
const weekStart = Date.UTC(2024, 0, 7) // 2024-01-07 是周日

/** 单日记录；`level` 只决定方块深浅，语义始终由 `count` 提供。 */
type Contribution = { date: string; count: number; level: number }

/** 按真实日期排列的贡献日历；空缺日期不冒充零贡献，数据表提供非颜色读取方式。 */
function ContributionGraph({
  data,
  className,
  locale = "zh-CN",
  lessLabel = "少",
  moreLabel = "多",
  legendLabel = "贡献数量由少到多",
  unitLabel = "次贡献",
  emptyLabel = "贡献日历暂未更新。下次构建时会自动重试获取数据。",
  regionLabel = "过去一年的 GitHub 贡献日历，可横向滚动；方向键查看相邻日期",
  detailsLabel = "查看每日贡献数据",
  captionLabel = "过去一年的每日贡献记录",
  dateHeadingLabel = "日期",
  countHeadingLabel = "贡献次数",
}: {
  /** 过去一年的每日记录，顺序任意；只绘制最后一天往前 365 天 */
  data: readonly Contribution[]
  /** 附加到根元素的样式类名 */
  className?: string
  /**
   * BCP 47 区域标识，决定月份、星期与数字的格式化方式
   * @default "zh-CN"
   */
  locale?: string
  /**
   * 图例起点文字
   * @default "少"
   */
  lessLabel?: string
  /**
   * 图例终点文字
   * @default "多"
   */
  moreLabel?: string
  /**
   * 图例的读屏说明
   * @default "贡献数量由少到多"
   */
  legendLabel?: string
  /**
   * 计数的单位，用于读屏标签与悬浮提示
   * @default "次贡献"
   */
  unitLabel?: string
  /**
   * 没有有效数据时的提示，说明下次构建会重试
   * @default "贡献日历暂未更新。下次构建时会自动重试获取数据。"
   */
  emptyLabel?: string
  /**
   * 可滚动区域的说明，供读屏使用
   * @default "过去一年的 GitHub 贡献日历，可横向滚动；方向键查看相邻日期"
   */
  regionLabel?: string
  /**
   * 数据表折叠标题
   * @default "查看每日贡献数据"
   */
  detailsLabel?: string
  /**
   * 数据表的读屏标题
   * @default "过去一年的每日贡献记录"
   */
  captionLabel?: string
  /**
   * 数据表表头：日期列
   * @default "日期"
   */
  dateHeadingLabel?: string
  /**
   * 数据表表头：数量列
   * @default "贡献次数"
   */
  countHeadingLabel?: string
}) {
  const [activeDate, setActiveDate] = useState<string | null>(null)
  const formatters = useMemo(
    () => ({
      date: new Intl.DateTimeFormat(locale, {
        timeZone: "UTC",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      month: new Intl.DateTimeFormat(locale, {
        timeZone: "UTC",
        month: "short",
      }),
      weekday: new Intl.DateTimeFormat(locale, {
        timeZone: "UTC",
        weekday: "narrow",
      }),
      number: new Intl.NumberFormat(locale),
    }),
    [locale],
  )
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
        month: day.getUTCDate() === 1 ? formatters.month.format(day) : null,
      })
    }
    return { weeks, entries }
  }, [data, formatters])

  if (!entries.length)
    return (
      <p
        data-slot="contribution-graph"
        data-state="empty"
        className={cn(
          "py-8 font-mono text-xs leading-6 text-muted-foreground",
          className,
        )}
      >
        {emptyLabel}
      </p>
    )
  return (
    <div
      data-slot="contribution-graph"
      data-state="ready"
      className={cn("min-w-0", className)}
    >
      <div
        data-slot="contribution-graph-scroll"
        role="region"
        aria-label={regionLabel}
        tabIndex={0}
        className="overflow-x-auto rounded-sm pb-2 focus-visible:outline-2 focus-visible:outline-ring"
      >
        <div className="flex w-max gap-2 font-mono text-[10px] text-muted-foreground">
          <div
            data-slot="contribution-graph-weekdays"
            aria-hidden="true"
            className="grid grid-rows-[18px_repeat(7,10px)] gap-[3px]"
          >
            <span />
            {Array.from({ length: 7 }, (_, index) => (
              <span key={index}>
                {weekdayRows.includes(index)
                  ? formatters.weekday.format(
                      new Date(weekStart + index * dayMilliseconds),
                    )
                  : null}
              </span>
            ))}
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
                          data-slot="contribution-graph-day"
                          data-level={Math.max(
                            0,
                            Math.min(4, Math.floor(day.level)),
                          )}
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
                          aria-label={`${formatters.date.format(new Date(date))}：${formatters.number.format(day.count)} ${unitLabel}`}
                          className={cn(
                            "size-[10px] rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                            levels[
                              Math.max(0, Math.min(4, Math.floor(day.level)))
                            ] ?? levels[0],
                          )}
                        />
                        <TooltipContent>
                          {formatters.date.format(new Date(date))} ·{" "}
                          {formatters.number.format(day.count)} {unitLabel}
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
        data-slot="contribution-graph-legend"
        role="img"
        aria-label={legendLabel}
        className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[10px] text-muted-foreground"
      >
        <span>{lessLabel}</span>
        {levels.map((level) => (
          <span
            key={level}
            aria-hidden="true"
            className={cn("size-2.5 rounded-[2px]", level)}
          />
        ))}
        <span>{moreLabel}</span>
      </div>
      <details
        data-slot="contribution-graph-details"
        className="mt-2 text-xs text-muted-foreground"
      >
        <summary className="w-fit cursor-pointer rounded py-1 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">
          {detailsLabel}
        </summary>
        <div className="mt-2 max-h-48 overflow-auto">
          <table
            data-slot="contribution-graph-table"
            className="w-full text-left font-mono tabular-nums"
          >
            <caption className="sr-only">{captionLabel}</caption>
            <thead>
              <tr>
                <th scope="col" className="py-2 font-normal">
                  {dateHeadingLabel}
                </th>
                <th scope="col" className="py-2 text-right font-normal">
                  {countHeadingLabel}
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
                    {formatters.number.format(day.count)}
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

export { ContributionGraph, type Contribution }
