"use client"

import * as React from "react"
import { Check, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import type { RegionPickerLabels } from "./config"
import {
  RegionPickerHighlight,
  RegionPickerLevels,
  RegionPickerNotice,
  RegionPickerOption,
} from "./region-picker-parts"
import type { RegionOption } from "./types"
import {
  formatRegionPath,
  isLeafRegion,
  searchRegionIndex,
  type RegionHighlight,
  type RegionIndex,
} from "./utils"

type Row = {
  node: RegionOption
  /** 从 0 数的层级 */
  level: number
  /** 从最顶层到该节点 */
  path: RegionOption[]
  highlights?: (RegionHighlight | null)[]
}

const EMPTY_PATH: RegionOption[] = []

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""))

/**
 * 浮层内容：搜索框 + 层级标签条 + 当前层级的选项（或搜索结果）。
 * 浮层关闭时整体卸载，所以浏览位置、搜索词每次打开都是全新的。
 */
function RegionPickerPanel({
  index,
  status,
  labels,
  value,
  valuePath,
  depth,
  allowPartial,
  required,
  inputRef,
  onRetry,
  onCommit,
}: {
  /** 数据没加载好时为 null */
  index: RegionIndex | null
  status: "loading" | "error" | "ready"
  labels: RegionPickerLabels
  value: string | null
  valuePath: RegionOption[]
  depth: number
  allowPartial: boolean
  required: boolean
  inputRef: React.RefObject<HTMLInputElement | null>
  onRetry: () => void
  /** 确认选择；空数组表示清除 */
  onCommit: (path: RegionOption[]) => void
}) {
  const baseId = React.useId()
  const listId = `${baseId}-list`
  const listRef = React.useRef<HTMLDivElement>(null)

  const [query, setQuery] = React.useState("")
  // null = 还没手动浏览过，跟随当前值所在的层级；这样懒加载的数据到了之后也能自动定位
  const [trailState, setTrailState] = React.useState<RegionOption[] | null>(
    null,
  )

  const defaultTrail = React.useMemo(
    () =>
      valuePath.slice(
        0,
        Math.max(0, Math.min(valuePath.length - 1, depth - 1)),
      ),
    [valuePath, depth],
  )
  const trail = trailState ?? defaultTrail
  const level = trail.length
  const roots = index?.roots ?? EMPTY_PATH
  const options = trail.length
    ? (trail[level - 1].children ?? EMPTY_PATH)
    : roots

  // 当前层级里属于已选路径的那一项（上级路径一致时才算）
  const selectedHere =
    valuePath.length > level &&
    trail.every((node, i) => node.code === valuePath[i].code)
      ? valuePath[level]
      : undefined

  const searching = query.trim() !== ""
  const search = React.useMemo(
    () => (index && searching ? searchRegionIndex(index, query) : null),
    [index, query, searching],
  )

  const rows = React.useMemo<Row[]>(() => {
    if (search)
      return search.results.map(({ node, level, path, highlights }) => ({
        node,
        level,
        path,
        highlights,
      }))
    return options.map((node) => ({
      node,
      level,
      path: [...trail, node],
    }))
  }, [search, options, trail, level])

  // 列表一换（进入下级、搜索词变化），高亮项回到已选项或第一项
  const listKey = searching
    ? `s:${query}`
    : `b:${trail.map((node) => node.code).join(",")}`
  const selectedCode = searching ? value : selectedHere?.code
  const selectedAt = rows.findIndex((row) => row.node.code === selectedCode)
  const fallbackActive = rows.length ? Math.max(0, selectedAt) : -1
  const [activeState, setActiveState] = React.useState({
    key: listKey,
    index: fallbackActive,
  })
  const active = Math.min(
    activeState.key === listKey ? activeState.index : fallbackActive,
    rows.length - 1,
  )
  const setActive = (next: number) =>
    setActiveState({ key: listKey, index: next })
  const activeId = active >= 0 ? `${baseId}-opt-${active}` : undefined

  // 键盘移动后把高亮项滚进视野；打开时也会把已选项滚出来
  React.useEffect(() => {
    if (!activeId) return
    document.getElementById(activeId)?.scrollIntoView({ block: "nearest" })
  }, [activeId, listKey])

  const choose = (row: Row) => {
    if (isLeafRegion(row.node, row.level, depth)) return onCommit(row.path)
    setTrailState(row.path)
    setQuery("")
    inputRef.current?.focus()
  }

  const goUp = (to: number) => {
    setTrailState(trail.slice(0, to))
    setQuery("")
    inputRef.current?.focus()
  }

  const columns = () => {
    const template = listRef.current
      ? getComputedStyle(listRef.current).gridTemplateColumns
      : ""
    return Math.max(1, template.split(" ").filter(Boolean).length)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // 拼音输入法组词时的方向键、回车是在选候选词，不能当作列表操作
    if (event.nativeEvent.isComposing) return
    const count = rows.length
    const cols = columns()
    switch (event.key) {
      case "ArrowDown": {
        if (!count) return
        event.preventDefault()
        const next = active + cols
        if (next < count) setActive(next)
        // 最后一行不满时，从倒数第二行往下落到最后一项
        else if (Math.floor(active / cols) < Math.floor((count - 1) / cols))
          setActive(count - 1)
        return
      }
      case "ArrowUp":
        if (!count) return
        event.preventDefault()
        if (active - cols >= 0) setActive(active - cols)
        return
      // 左右键平时是移动光标，搜索框为空且是多列网格时才用来横向移动
      case "ArrowRight":
        if (!count || query || cols < 2) return
        event.preventDefault()
        setActive(Math.min(count - 1, active + 1))
        return
      case "ArrowLeft":
        if (!count || query || cols < 2) return
        event.preventDefault()
        setActive(Math.max(0, active - 1))
        return
      case "Enter":
        event.preventDefault()
        if (active >= 0) choose(rows[active])
        return
      case "Backspace":
        if (!query && trail.length) {
          event.preventDefault()
          goUp(trail.length - 1)
        }
        return
    }
  }

  const ready = status === "ready" && index !== null
  const announcement = !ready
    ? status === "error"
      ? labels.loadFailed
      : labels.loading
    : searching
      ? search && search.total
        ? fill(labels.resultStatus, { count: search.total })
        : labels.empty
      : fill(labels.levelStatus, { level: level + 1, count: rows.length })

  const showConfirm = allowPartial && !searching && ready && trail.length > 0
  const showClear = value !== null && !required

  return (
    <div data-slot="region-picker-panel" className="flex flex-col gap-2.5">
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          ref={inputRef}
          data-slot="region-picker-search"
          role="combobox"
          aria-label={labels.searchLabel}
          aria-expanded="true"
          aria-autocomplete="list"
          aria-controls={ready && rows.length ? listId : undefined}
          aria-activedescendant={ready ? activeId : undefined}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder={labels.searchPlaceholder}
          className="pl-8"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
        />
      </div>

      {ready && !searching && (
        <RegionPickerLevels
          trail={trail}
          currentLabel={selectedHere?.name}
          pendingLabel={labels.levelPending}
          ariaLabel={labels.levelNav}
          onSelect={goUp}
        />
      )}

      {!ready ? (
        status === "error" ? (
          <RegionPickerNotice>
            <span>{labels.loadFailed}</span>
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              {labels.retry}
            </Button>
          </RegionPickerNotice>
        ) : (
          <RegionPickerNotice loading>{labels.loading}</RegionPickerNotice>
        )
      ) : rows.length ? (
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={labels.searchLabel}
          data-slot="region-picker-list"
          className={cn(
            "max-h-60 overflow-y-auto overscroll-contain",
            searching
              ? "flex flex-col gap-0.5"
              : "grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-1",
          )}
        >
          {rows.map((row, i) => {
            const leaf = isLeafRegion(row.node, row.level, depth)
            const selected = row.node.code === selectedCode
            return (
              <RegionPickerOption
                key={row.path.map((node) => node.code).join("/")}
                id={`${baseId}-opt-${i}`}
                title={formatRegionPath(row.path)}
                active={i === active}
                selected={selected}
                branch={!leaf}
                onSelect={() => choose(row)}
                onHover={() => i !== active && setActive(i)}
              >
                {searching ? (
                  <>
                    <span className="min-w-0 flex-1 truncate">
                      {row.path.map((node, at) => (
                        <React.Fragment key={node.code}>
                          {at > 0 && (
                            <span className="text-muted-foreground/60">
                              {" / "}
                            </span>
                          )}
                          <span
                            className={cn(
                              at < row.level && "text-muted-foreground",
                            )}
                          >
                            <RegionPickerHighlight
                              text={node.name}
                              range={row.highlights?.[at]?.name}
                            />
                          </span>
                        </React.Fragment>
                      ))}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                      <RegionPickerHighlight
                        text={row.node.code}
                        range={row.highlights?.[row.level]?.code}
                      />
                    </span>
                  </>
                ) : (
                  <span className="truncate">{row.node.name}</span>
                )}
                {selected && leaf && (
                  <Check
                    aria-hidden="true"
                    className="ml-auto size-3.5 shrink-0"
                  />
                )}
              </RegionPickerOption>
            )
          })}
        </div>
      ) : (
        <RegionPickerNotice>{labels.empty}</RegionPickerNotice>
      )}

      {search && search.total > search.results.length && (
        <p
          data-slot="region-picker-hint"
          className="px-1 text-xs text-muted-foreground"
        >
          {fill(labels.resultTruncated, { limit: search.results.length })}
        </p>
      )}

      {(showConfirm || showClear) && (
        <div
          data-slot="region-picker-footer"
          className="flex items-center gap-2 border-t border-border pt-2.5"
        >
          {showConfirm && (
            <Button
              type="button"
              size="sm"
              className="min-w-0"
              onClick={() => onCommit(trail)}
            >
              <span className="truncate">
                {fill(labels.confirmPartial, { name: formatRegionPath(trail) })}
              </span>
            </Button>
          )}
          {showClear && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-auto shrink-0"
              onClick={() => onCommit(EMPTY_PATH)}
            >
              {labels.clear}
            </Button>
          )}
        </div>
      )}

      <span role="status" className="sr-only">
        {announcement}
      </span>
    </div>
  )
}

export { RegionPickerPanel }
