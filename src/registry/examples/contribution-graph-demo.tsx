import {
  ContributionGraph,
  type Contribution,
} from "@/registry/ui/contribution-graph/contribution-graph"

const dayMilliseconds = 86_400_000
// 固定结束日期与随机种子，保证构建产物与浏览器首屏完全一致。
const endDate = Date.UTC(2025, 11, 31)
const seed = 20_250_101

/** mulberry32：种子相同则序列相同，演示数据不会每天变化。 */
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
  if (count < 3) return 1
  if (count < 6) return 2
  if (count < 10) return 3
  return 4
}

const random = createRandom(seed)

const contributions: Contribution[] = Array.from(
  { length: 365 },
  (_, index) => {
    const stamp = endDate - (364 - index) * dayMilliseconds
    const date = new Date(stamp)
    const weekday = date.getUTCDay()
    // 周末与假期密度更低，偶尔整天没有贡献。
    const weight = weekday === 0 || weekday === 6 ? 0.25 : 1
    const idle = random() < 0.12
    const count = idle ? 0 : Math.round(random() ** 2 * 16 * weight)
    return {
      date: date.toISOString().slice(0, 10),
      count,
      level: levelOf(count),
    }
  },
)

export default function ContributionGraphDemo() {
  return (
    <div className="w-full max-w-3xl">
      <ContributionGraph data={contributions} />
    </div>
  )
}
