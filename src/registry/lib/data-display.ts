/**
 * 数据展示共用工具：涨跌配色约定、色调、数字与日期格式化。
 * stat-card、mini-chart、chart-card 三个条目共用这一份，所以涨跌色、数字格式只在这里定义。
 */

/**
 * 涨跌配色约定：
 * - `intl`（默认）：绿涨红跌；
 * - `cn`：红涨绿跌，国内行情软件的习惯。
 */
type DataConvention = "intl" | "cn"

// 约定只改写 `--stat-up` / `--stat-down` 两个 CSS 变量。变量沿 DOM 向下继承，
// 所以给整块看板的外层设一次 `convention`，里面所有涨跌色（包括图表里的 SVG）都跟着变，
// 不需要 context，服务端组件也能用。没有设置时回落到默认的绿涨红跌。
const CONVENTION_CLASSES: Record<DataConvention, string> = {
  intl: "[--stat-up:var(--flow-green,var(--primary))] [--stat-down:var(--flow-rose,var(--destructive))]",
  cn: "[--stat-up:var(--flow-rose,var(--destructive))] [--stat-down:var(--flow-green,var(--primary))]",
}

/** 把 `convention` 换成要加到根元素上的类名；不传返回 `undefined`，沿用外层的约定。 */
function conventionClass(convention?: DataConvention) {
  return convention ? CONVENTION_CLASSES[convention] : undefined
}

type Trend = "up" | "down" | "flat"

function trendOf(value: number): Trend {
  return value > 0 ? "up" : value < 0 ? "down" : "flat"
}

/** 涨跌文字色（Tailwind 只认完整类名，所以三种写全）。 */
const TREND_TEXT: Record<Trend, string> = {
  up: "text-[color:var(--stat-up,var(--flow-green,var(--primary)))]",
  down: "text-[color:var(--stat-down,var(--flow-rose,var(--destructive)))]",
  flat: "text-muted-foreground",
}

/**
 * 内置色调：
 * - `primary`、`foreground`、`muted`、`destructive` 直接引用主题变量，跟随颜色主题；
 * - `blue` 等多彩色调引用 `--flow-*` 变量，没有安装时回落到主题强调色；
 * - `chart-1` … `chart-5` 引用主题的图表色板；
 * - `up` / `down` 是涨跌色，随 `convention` 变化。
 */
type DataToneName =
  | "primary"
  | "foreground"
  | "muted"
  | "destructive"
  | "blue"
  | "green"
  | "amber"
  | "rose"
  | "violet"
  | "cyan"
  | "chart-1"
  | "chart-2"
  | "chart-3"
  | "chart-4"
  | "chart-5"
  | "up"
  | "down"

/** 色调：内置名，或任意 CSS 颜色（`"var(--brand)"`、`"oklch(0.7 0.2 150)"` 都可以）。 */
type DataTone = DataToneName | (string & {})

const TONES: Record<DataToneName, string> = {
  primary: "var(--primary)",
  foreground: "var(--foreground)",
  muted: "var(--muted-foreground)",
  destructive: "var(--destructive)",
  blue: "var(--flow-blue, var(--primary))",
  green: "var(--flow-green, var(--primary))",
  amber: "var(--flow-amber, var(--primary))",
  rose: "var(--flow-rose, var(--destructive))",
  violet: "var(--flow-violet, var(--primary))",
  cyan: "var(--flow-cyan, var(--primary))",
  "chart-1": "var(--chart-1)",
  "chart-2": "var(--chart-2)",
  "chart-3": "var(--chart-3)",
  "chart-4": "var(--chart-4)",
  "chart-5": "var(--chart-5)",
  up: "var(--stat-up, var(--flow-green, var(--primary)))",
  down: "var(--stat-down, var(--flow-rose, var(--destructive)))",
}

/** 把色调换成可直接用于 `fill` / `stroke` / `color` 的 CSS 颜色。 */
function toneColor(tone: DataTone): string {
  return Object.hasOwn(TONES, tone) ? TONES[tone as DataToneName] : tone
}

/** 多序列图表默认的色调轮换：第一条跟随主题强调色，其余取多彩色调。 */
const SERIES_TONES: DataTone[] = [
  "primary",
  "blue",
  "amber",
  "violet",
  "cyan",
  "green",
  "rose",
]

type StatFormatOptions = {
  /**
   * 数字样式：`number` 普通数字，`percent` 百分比（传入的 12.5 表示 12.5%），`currency` 货币
   * @default "number"
   */
  style?: "number" | "percent" | "currency"
  /**
   * BCP 47 区域标识；`zh-CN` 压缩成「万 / 亿」，`en` 压缩成 K / M / B
   * @default "zh-CN"
   */
  locale?: string
  /**
   * 压缩大数（1.2万、3.4亿）；百分比不压缩
   * @default true
   */
  compact?: boolean
  /**
   * 货币代码，仅 `style="currency"` 生效；人民币显示 ¥
   * @default "CNY"
   */
  currency?: string
  /**
   * 最多保留的小数位
   * @default 1（压缩与百分比），2（普通数字与货币）
   */
  digits?: number
  /**
   * 正数前加 `+`（零不加），用于涨跌幅
   * @default false
   */
  sign?: boolean
}

const formatters = new Map<string, Intl.NumberFormat>()

/**
 * 格式化统计数字，默认 `zh-CN` 压缩：`12480` → `1.2万`，`345000000` → `3.5亿`；
 * `locale: "en"` 时为 `12K`、`345M`。同参数的 `Intl.NumberFormat` 会被缓存复用。
 */
function formatStat(value: number, options: StatFormatOptions = {}): string {
  const {
    style = "number",
    locale = "zh-CN",
    compact = style !== "percent",
    currency = "CNY",
    sign = false,
  } = options
  const digits = options.digits ?? (compact || style === "percent" ? 1 : 2)
  const key = [style, locale, compact, currency, digits, sign].join("|")
  let formatter = formatters.get(key)
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: style === "number" ? "decimal" : style,
      currency: style === "currency" ? currency : undefined,
      currencyDisplay: style === "currency" ? "narrowSymbol" : undefined,
      notation: compact && style !== "percent" ? "compact" : "standard",
      maximumFractionDigits: digits,
      signDisplay: sign ? "exceptZero" : "auto",
    })
    formatters.set(key, formatter)
  }
  return formatter.format(style === "percent" ? value / 100 : value)
}

type DayStyle = "long" | "short" | "weekday"

const dayFormatters = new Map<string, Intl.DateTimeFormat>()

/**
 * 格式化日期轴文字：`long` → `2月14日`，`short` → `02/14`，`weekday` → `一`（单字星期）。
 * 日期按 UTC 解析与输出，`"2026-02-14"` 这类字符串在任何时区、任何环境下结果一致，不会引起水合差异。
 */
function formatDay(
  input: string | number | Date,
  style: DayStyle = "long",
  locale = "zh-CN",
): string {
  const key = `${style}|${locale}`
  let formatter = dayFormatters.get(key)
  if (!formatter) {
    const options: Intl.DateTimeFormatOptions =
      style === "weekday"
        ? { weekday: "narrow" }
        : style === "short"
          ? { month: "2-digit", day: "2-digit" }
          : { month: "long", day: "numeric" }
    formatter = new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" })
    dayFormatters.set(key, formatter)
  }
  return formatter.format(new Date(input))
}

export {
  TREND_TEXT,
  SERIES_TONES,
  conventionClass,
  formatDay,
  formatStat,
  toneColor,
  trendOf,
}
export type {
  DataConvention,
  DataTone,
  DataToneName,
  DayStyle,
  StatFormatOptions,
  Trend,
}
