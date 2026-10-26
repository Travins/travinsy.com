// 时区计算：全部基于 Intl，不引入时区库。Intl.DateTimeFormat 构造较慢，按参数缓存。

type ClockOptions = {
  locale: string
  timeZone: string
  /** 12 小时制；默认 24 小时制 */
  hour12?: boolean
  showSeconds?: boolean
}

const formatters = new Map<string, Intl.DateTimeFormat>()

function formatter(
  locale: string,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  const key = `${locale}|${JSON.stringify(options)}`
  let cached = formatters.get(key)
  if (!cached) {
    cached = new Intl.DateTimeFormat(locale, options)
    formatters.set(key, cached)
  }
  return cached
}

/** 把时间拆成可逐位渲染的片段（hour / minute / second / literal / dayPeriod）。 */
function clockParts(date: Date, options: ClockOptions) {
  return formatter(options.locale, {
    timeZone: options.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: options.showSeconds === false ? undefined : "2-digit",
    hourCycle: options.hour12 ? "h12" : "h23",
  }).formatToParts(date)
}

/** 目标时区相对 UTC 的偏移分钟数，夏令时自动跟随。 */
function offsetMinutes(timeZone: string, date: Date) {
  const zone =
    formatter("en-US", { timeZone, timeZoneName: "longOffset" })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value ?? "GMT"
  const match = zone.match(/GMT([+-])(\d{2}):(\d{2})/)
  if (!match) return 0
  const minutes = Number(match[2]) * 60 + Number(match[3])
  return match[1] === "+" ? minutes : -minutes
}

/** 目标时区比访客时区快（正）或慢（负）几个小时。 */
function hourDifference(timeZone: string, date: Date) {
  return (offsetMinutes(timeZone, date) + date.getTimezoneOffset()) / 60
}

/** `UTC+8`、`UTC+5:30`、`UTC`。 */
function utcLabel(minutes: number) {
  if (minutes === 0) return "UTC"
  const sign = minutes > 0 ? "+" : "-"
  const abs = Math.abs(minutes)
  const hours = Math.floor(abs / 60)
  const rest = abs % 60
  return `UTC${sign}${hours}${rest ? `:${String(rest).padStart(2, "0")}` : ""}`
}

/** 目标时区此刻的小时数（0–23）。 */
function zoneHour(timeZone: string, date: Date) {
  const hour = formatter("en-US", {
    timeZone,
    hour: "numeric",
    hourCycle: "h23",
  }).format(date)
  return Number(hour) % 24
}

/** 6:00–17:59 算白天；与时区所在半球和季节无关，只作视觉提示。 */
function isDaytime(hour: number) {
  return hour >= 6 && hour < 18
}

/** 目标时区的日期比访客本地日期晚一天（1）、早一天（-1）或同一天（0）。 */
function dayOffset(timeZone: string, date: Date) {
  const key = (parts: Intl.DateTimeFormatPart[]) => {
    const value = (type: string) =>
      parts.find((part) => part.type === type)?.value ?? ""
    return `${value("year")}-${value("month")}-${value("day")}`
  }
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  } as const
  const target = key(
    formatter("en-US", { ...options, timeZone }).formatToParts(date),
  )
  const local = key(formatter("en-US", options).formatToParts(date))
  return target === local ? 0 : target > local ? 1 : -1
}

/** 时差的文字描述：与访客同一时间时返回 `same`，否则 `早/晚 N 小时`。 */
function describeDifference(
  difference: number,
  locale: string,
  text: { same: string; ahead: string; behind: string; hourUnit: string },
) {
  if (difference === 0) return text.same
  const amount = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(Math.abs(difference))
  return `${difference > 0 ? text.ahead : text.behind} ${amount} ${text.hourUnit}`
}

export {
  clockParts,
  dayOffset,
  describeDifference,
  hourDifference,
  isDaytime,
  offsetMinutes,
  utcLabel,
  zoneHour,
}
export type { ClockOptions }
