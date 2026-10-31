/** 页码槽位：数字是页码，`"gap-start"` / `"gap-end"` 是省略号 */
type PaginationSlot = number | "gap-start" | "gap-end"

/**
 * 计算要渲染的页码槽位。
 * 固定槽位：总页数多于 `siblings × 2 + 5` 时，始终返回同样数量的格子（首页、末页、当前页及两侧、
 * 两个省略号或补位页码），翻页时分页条宽度不变，按钮不会在鼠标下移位。
 */
function getPaginationSlots(
  page: number,
  pageCount: number,
  siblings = 1,
): PaginationSlot[] {
  const count = Math.max(1, Math.trunc(pageCount) || 1)
  const current = Math.min(count, Math.max(1, Math.trunc(page) || 1))
  const radius = Math.max(0, Math.trunc(siblings) || 0)
  const slots = radius * 2 + 5
  const range = (from: number, to: number) =>
    Array.from({ length: to - from + 1 }, (_, i) => from + i)

  if (count <= slots) return range(1, count)
  if (current <= radius + 3) return [...range(1, slots - 2), "gap-end", count]
  if (current >= count - radius - 2)
    return [1, "gap-start", ...range(count - slots + 3, count)]
  return [
    1,
    "gap-start",
    ...range(current - radius, current + radius),
    "gap-end",
    count,
  ]
}

/** 当前页对应的条目范围（从 1 开始）；没有数据时返回 0–0 */
function getPaginationRange(page: number, pageSize: number, total: number) {
  const size = Math.max(1, pageSize)
  const sum = Math.max(0, total)
  return {
    from: sum > 0 ? Math.min(sum, (page - 1) * size + 1) : 0,
    to: Math.min(sum, page * size),
  }
}

export { getPaginationRange, getPaginationSlots }
export type { PaginationSlot }
