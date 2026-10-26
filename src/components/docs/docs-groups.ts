import type { NavSectionId } from "./docs-nav"

export type GroupDef = {
  /** 稳定 id，也是 MDX frontmatter `group` 的取值 */
  id: string
  title: string
  /** 英文标签（Title Case），侧栏与列表页的小标题用 */
  titleEn: string
}

/**
 * 各分区的分组表：数组顺序即展示顺序（侧栏、列表页、上一页 / 下一页都按它排）。
 * 条目在 MDX frontmatter 里用 `group: <id>` 归组；没写 `group` 的条目进默认组（无小标题，排在最前）。
 * 没有登记的分区不分组；frontmatter 里写了表里没有的 id 会在构建时报错。
 */
export const sectionGroups: Partial<Record<NavSectionId, GroupDef[]>> = {
  components: [
    { id: "layout", title: "布局", titleEn: "Layout" },
    { id: "time", title: "时间", titleEn: "Time" },
    { id: "graphics", title: "图形与动效", titleEn: "Graphics & Motion" },
    { id: "links", title: "链接与社交", titleEn: "Links & Social" },
  ],
}

export type EntryGroup<T> = {
  /** 默认组为空串 */
  id: string
  title?: string
  titleEn?: string
  items: T[]
}

/**
 * 按分组表把条目分组：默认组在前，其余按表的顺序，组内保持原有顺序，空组省略。
 * `groupOf` 返回条目 frontmatter 里的 `group`。
 */
export function groupEntries<T>(
  section: NavSectionId,
  entries: T[],
  groupOf: (entry: T) => string | undefined,
): EntryGroup<T>[] {
  const defs = sectionGroups[section] ?? []
  const buckets = new Map<string, T[]>([["", []]])
  for (const def of defs) buckets.set(def.id, [])
  for (const entry of entries) {
    const id = groupOf(entry) ?? ""
    const bucket = buckets.get(id)
    if (!bucket) {
      throw new Error(
        `分区 ${section} 没有登记分组 "${id}"，请在 src/components/docs/docs-groups.ts 添加。`,
      )
    }
    bucket.push(entry)
  }
  const groups: EntryGroup<T>[] = []
  const rest = buckets.get("")!
  if (rest.length) groups.push({ id: "", items: rest })
  for (const def of defs) {
    const items = buckets.get(def.id)!
    if (items.length)
      groups.push({ id: def.id, title: def.title, titleEn: def.titleEn, items })
  }
  return groups
}
