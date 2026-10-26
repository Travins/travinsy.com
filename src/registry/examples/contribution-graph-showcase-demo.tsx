import {
  ContributionGraph,
  type Contribution,
} from "@/registry/ui/contribution-graph/contribution-graph"

const dayMilliseconds = 86_400_000
// 固定结束日期与随机种子：构建产物与浏览器首屏一致。
const endDate = Date.UTC(2025, 11, 31)

/** mulberry32：种子相同则序列相同。 */
function createRandom(initial: number) {
  let state = initial
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let value = Math.imul(state ^ (state >>> 15), state | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296
  }
}

function levelOf(count: number) {
  if (count === 0) return 0
  if (count < 4) return 1
  if (count < 8) return 2
  if (count < 13) return 3
  return 4
}

// 越接近年底越活跃，并带几段连续高产的「冲刺周」，让深浅层次一眼可见。
const random = createRandom(20_251_231)
const contributions: Contribution[] = Array.from(
  { length: 365 },
  (_, index) => {
    const date = new Date(endDate - (364 - index) * dayMilliseconds)
    const weekday = date.getUTCDay()
    const trend = 0.45 + (index / 364) * 0.9
    const sprint = Math.sin(index / 9) > 0.55 ? 1.6 : 1
    const weekend = weekday === 0 || weekday === 6 ? 0.35 : 1
    const count =
      random() < 0.07
        ? 0
        : Math.round(random() ** 1.6 * 18 * trend * sprint * weekend)
    return {
      date: date.toISOString().slice(0, 10),
      count,
      level: levelOf(count),
    }
  },
)

/**
 * 贡献热力图封面：放大到方块清晰可辨，只露出最近半年，左右边缘渐隐，
 * 暗示它是一张还能继续向前滚动的年度日历。图例与数据表折叠区在方块下方，下移让方块居中。
 */
export default function ContributionGraphShowcaseDemo() {
  return (
    <div className="flex size-full items-center justify-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent)]">
      <div className="w-[46rem] shrink-0 translate-y-8 scale-[1.45]">
        <ContributionGraph data={contributions} />
      </div>
    </div>
  )
}
