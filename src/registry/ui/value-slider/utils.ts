/** 把数值夹在 [0, 1] 之间。 */
function clamp01(value: number) {
  if (!Number.isFinite(value)) return 0
  return Math.min(1, Math.max(0, value))
}

/**
 * 橡皮筋拉伸量：指针越过轨道边界 `distance` 像素时的视觉拉伸。
 * 曲线是饱和的（越拉越难拉），结果永远小于 `max`，所以轨道不会被拉得没边。
 */
function rubberBand(distance: number, max: number) {
  if (!Number.isFinite(max) || max <= 0 || distance <= 0) return 0
  return max * (1 - 1 / (1 + (0.55 * distance) / max))
}

/** 值在轨道内的百分比（0–100）。 */
function valueToPercent(value: number, min: number, max: number) {
  const span = max - min
  if (!Number.isFinite(span) || span <= 0) return 0
  return Math.min(100, Math.max(0, ((value - min) / span) * 100))
}

/** step 的小数位数：1 → 0，0.5 → 1，0.05 → 2，用于读数与读屏文本。 */
function stepDecimals(step: number) {
  if (!Number.isFinite(step) || step <= 0) return 0
  const text = String(step)
  const exponential = text.split("e-")[1]
  if (exponential) return Math.min(6, Number(exponential))
  const dot = text.indexOf(".")
  return dot === -1 ? 0 : Math.min(6, text.length - dot - 1)
}

/** 单值 / 区间统一取成升序数组，区间时报文的顺序与 Base UI 一致。 */
function toNumberList(value: number | readonly number[]) {
  if (typeof value === "number") return [value]
  return [...value].sort((a, b) => a - b)
}

/**
 * 把 `ticks` 属性换算成刻度值数组（含两端）。
 * 数字表示等分段数，返回 n + 1 个值，其中 n - 1 个落在轨道内部；数组则原样排序、去重并夹在范围内。
 */
function resolveTicks(
  ticks: number | readonly number[] | undefined,
  min: number,
  max: number,
) {
  if (ticks === undefined) return []
  if (typeof ticks !== "number") {
    const list = ticks
      .filter((item) => Number.isFinite(item) && item >= min && item <= max)
      .sort((a, b) => a - b)
    return list.filter((item, index) => index === 0 || item !== list[index - 1])
  }
  const count = Math.floor(ticks)
  if (!Number.isFinite(count) || count < 2) return []
  return Array.from(
    { length: count + 1 },
    (_, index) => min + ((max - min) * index) / count,
  )
}

/** 离该值最近的刻度值；没有刻度时返回 undefined。 */
function nearestTick(value: number, ticks: readonly number[]) {
  let nearest: number | undefined
  let distance = Infinity
  for (const tick of ticks) {
    const next = Math.abs(tick - value)
    if (next < distance) {
      distance = next
      nearest = tick
    }
  }
  return nearest
}

/** 从 `from` 走到 `to` 的过程中是否越过了某个刻度（含 `to` 所在的刻度，不含 `from`）。 */
function crossedTick(from: number, to: number, ticks: readonly number[]) {
  const low = Math.min(from, to)
  const high = Math.max(from, to)
  return ticks.some((tick) => tick > low && tick <= high)
}

/**
 * 把值对齐到 `min + n * step` 并夹在 [min, max]，值不是有限数时返回 `undefined`。
 *
 * 浮点误差靠「搬到整数域再算」消除：按 min / step / value 三者里最多的小数位放大成整数，
 * 算出整数序号后再除回去，所以 0.1 这种二进制表示不精确的 step 也不会跑出 0.30000000000000004。
 * 上界直接用 `max`（与 Base UI 一致：即使 `max` 不在步长网格上，键盘与指针也能取到它）。
 *
 * 例：min=0.05 step=0.1 tick=0.15 → 0.15；min=2700 step=100 tick=3650 → 3700。
 */
function alignToStep(value: number, min: number, max: number, step: number) {
  if (!Number.isFinite(value)) return undefined
  const clamped = Math.min(max, Math.max(min, value))
  if (!Number.isFinite(step) || step <= 0) return clamped
  const decimals = Math.max(
    stepDecimals(min),
    stepDecimals(step),
    stepDecimals(clamped),
  )
  const factor = 10 ** decimals
  const minInt = Math.round(min * factor)
  const stepInt = Math.max(1, Math.round(step * factor))
  const valueInt = Math.round(clamped * factor)
  const alignedInt = minInt + Math.round((valueInt - minInt) / stepInt) * stepInt
  // 除法得到的是该十进制值最接近的 double，等价于字面量，不需要再 toFixed
  const aligned = alignedInt / factor
  return Math.min(max, Math.max(min, aligned))
}

type SnapToTicksOptions = {
  /** 吸附目标（含两端的刻度值） */
  ticks: readonly number[]
  min: number
  max: number
  /** 吸附后的值要对齐到 `min + n * step`，否则会提交不在步长上的值 */
  step: number
  /** 区间模式下两个值之间至少相隔几个 step */
  minGapSteps?: number
  /** 与刻度的最大距离，绝对值（由调用方按值域比例算好） */
  tolerance: number
}

/**
 * 磁吸：凡是离刻度不超过 `tolerance` 的值，吸到该刻度并按 step 对齐后的位置。
 * 区间模式下吸附后的值必须保持顺序、并与相邻值至少相隔 `minGapSteps` 个 step，
 * 不满足就放弃这个值的吸附（宁可不动，也不要产生倒序或贴合的两个手柄）。
 */
function snapValuesToTicks(
  values: readonly number[],
  options: SnapToTicksOptions,
) {
  const { ticks, min, max, step, minGapSteps = 0, tolerance } = options
  const gap = Math.max(0, minGapSteps) * (Number.isFinite(step) ? step : 0)
  const result = [...values]
  for (let index = 0; index < values.length; index += 1) {
    const current = values[index]
    const nearest = nearestTick(current, ticks)
    if (nearest === undefined) continue
    if (Math.abs(nearest - current) > tolerance) continue
    const aligned = alignToStep(nearest, min, max, step)
    if (aligned === undefined) continue
    const before = result[index - 1]
    const after = result[index + 1]
    if (before !== undefined && aligned < before + gap) continue
    if (after !== undefined && aligned > after - gap) continue
    result[index] = aligned
  }
  return result
}

/** 单值与区间共用的相等判断，用于磁吸前后比较。 */
function sameValue(
  a: number | readonly number[],
  b: number | readonly number[],
) {
  if (typeof a === "number" || typeof b === "number") return a === b
  const left = a as readonly number[]
  const right = b as readonly number[]
  return (
    left.length === right.length &&
    left.every((item, index) => item === right[index])
  )
}

export {
  alignToStep,
  clamp01,
  crossedTick,
  nearestTick,
  resolveTicks,
  rubberBand,
  sameValue,
  snapValuesToTicks,
  stepDecimals,
  toNumberList,
  valueToPercent,
}
export type { SnapToTicksOptions }
