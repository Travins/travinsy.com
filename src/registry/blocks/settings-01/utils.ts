import { DEFAULT_LABELS } from "./config"

/** 两个设置值是否相同；区间（数组）逐项比较。 */
function isSameValue(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) && Array.isArray(b))
    return a.length === b.length && a.every((item, index) => item === b[index])
  return Object.is(a, b)
}

/**
 * 把小时数格式化成「22:00」。
 * 免打扰滑块的范围是 12–36（跨午夜），所以先对 24 取模；用 Intl 并固定 UTC，保证服务端与客户端一致。
 */
function formatHour(hour: number, locale: string = "zh-CN"): string {
  const whole = Math.floor(hour)
  const minutes = Math.round((hour - whole) * 60)
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(1970, 0, 1, whole % 24, minutes)))
}

/** 把未知错误转成可展示的文案；没有 message 时用兜底文案。 */
function errorMessage(
  error: unknown,
  fallback: string = DEFAULT_LABELS.saveFailed,
) {
  return error instanceof Error && error.message ? error.message : fallback
}

export { errorMessage, formatHour, isSameValue }
