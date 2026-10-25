"use client"

import { Dialog } from "@base-ui/react/dialog"
import { staticClient } from "fumadocs-core/search/client/orama-static"
import type { SortedResult } from "fumadocs-core/search"
import { SearchIcon, XIcon, ArrowUpRightIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react"
import {
  SEARCH_INDEX_URL,
  searchGroup,
  searchGroups,
  searchShortcuts,
} from "@/lib/search"

const client = staticClient({
  from: SEARCH_INDEX_URL,
  search: { limit: 40, threshold: 0 },
})
type Result = { title: string; snippet: string; url: string }

function resultsForDisplay(results: SortedResult[]): Result[] {
  const titles = new Map(
    results
      .filter((item) => item.type === "page")
      .map((item) => [item.url, item.content]),
  )
  const seen = new Set<string>()
  return results.flatMap((item) => {
    if (
      item.type === "page" &&
      results.some(
        (match) =>
          match.type !== "page" && match.url.split("#")[0] === item.url,
      )
    )
      return []
    if (seen.has(item.url)) return []
    seen.add(item.url)
    return [
      {
        title: titles.get(item.url.split("#")[0]) ?? item.content,
        snippet: item.type === "page" ? "打开页面" : item.content,
        url: item.url,
      },
    ]
  })
}

function Highlight({ text, query }: { text: string; query: string }) {
  const words = query.trim()
    ? [
        ...new Set([
          query.trim(),
          ...Array.from(
            new Intl.Segmenter("zh-CN", { granularity: "word" }).segment(query),
            (part) => (part.isWordLike ? part.segment : ""),
          ).filter(Boolean),
        ]),
      ]
    : []
  const pattern = words
    .sort((a, b) => b.length - a.length)
    .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")
  const first = pattern ? text.search(new RegExp(pattern, "i")) : -1
  const start = first > 60 ? first - 40 : 0
  const excerpt = `${start ? "…" : ""}${text.slice(start, start + 180)}${text.length > start + 180 ? "…" : ""}`
  if (!pattern) return excerpt
  return excerpt.split(new RegExp(`(${pattern})`, "gi")).map((part, index) =>
    index % 2 ? (
      <mark key={index} className="bg-primary/15 font-medium text-foreground">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

export default function SearchDialog({
  open,
  onOpenChange,
  trigger,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger: RefObject<HTMLButtonElement | null>
}) {
  const router = useRouter()
  const input = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState<{
    query: string
    results: SortedResult[]
  }>({ query: "", results: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selected, setSelected] = useState(0)
  const id = useId()

  useEffect(() => {
    if (!open) return
    let cancelled = false
    const timeout = setTimeout(() => {
      Promise.resolve(client.search(query.trim()))
        .then((results) => {
          if (cancelled) return
          setResponse({ query, results })
          setLoading(false)
          setError(false)
        })
        .catch(() => {
          if (cancelled) return
          setError(true)
          setLoading(false)
        })
    }, 100)
    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [open, query])

  const results = useMemo(
    () => resultsForDisplay(response.results),
    [response.results],
  )
  const ordered = searchGroups.flatMap((group) =>
    results.filter((item) => searchGroup(item.url) === group),
  )
  const pending = loading || query !== response.query
  const items =
    query.trim() && !error && (ordered.length || pending)
      ? ordered
      : searchShortcuts.map((item) => ({ ...item, snippet: "快捷入口" }))
  const active = Math.min(selected, Math.max(0, items.length - 1))

  useEffect(() => {
    if (open)
      document
        .getElementById(`${id}-result-${active}`)
        ?.scrollIntoView({ block: "nearest" })
  }, [active, id, open])

  function navigate(url: string) {
    onOpenChange(false)
    router.push(url)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
        <Dialog.Popup
          initialFocus={input}
          finalFocus={trigger}
          className="fixed top-[min(15vh,6rem)] left-1/2 z-50 flex max-h-[75dvh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 flex-col overflow-hidden rounded-lg border border-edge bg-background text-foreground shadow-lg outline-none"
        >
          <Dialog.Title className="sr-only">搜索全站</Dialog.Title>
          <Dialog.Description className="sr-only">
            搜索组件、区块、模板、Agent
            指南与博客。使用上下方向键选择结果，回车打开，Escape 关闭。
          </Dialog.Description>
          <div className="screen-line-bottom flex shrink-0 items-center gap-3 px-4 py-3 focus-within:ring-2 focus-within:ring-ring focus-within:ring-inset">
            <SearchIcon
              aria-hidden
              className="size-4 shrink-0 text-muted-foreground"
            />
            <input
              ref={input}
              name="search"
              type="text"
              inputMode="search"
              role="combobox"
              aria-label="搜索关键词"
              aria-autocomplete="list"
              aria-expanded="true"
              aria-controls={`${id}-results`}
              aria-activedescendant={
                items[active] ? `${id}-result-${active}` : undefined
              }
              value={query}
              placeholder="搜索文档、组件与博客…"
              autoComplete="off"
              spellCheck={false}
              className="h-9 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
              onChange={(event) => {
                setQuery(event.target.value)
                setSelected(0)
                setLoading(true)
              }}
              onKeyDown={(event) => {
                if (event.nativeEvent.isComposing) return
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault()
                  setSelected(
                    items.length
                      ? (active +
                          (event.key === "ArrowDown" ? 1 : -1) +
                          items.length) %
                          items.length
                      : 0,
                  )
                } else if (event.key === "Enter" && items[active]) {
                  event.preventDefault()
                  navigate(items[active].url)
                }
              }}
            />
            <Dialog.Close
              aria-label="关闭搜索"
              className="flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            >
              <XIcon aria-hidden className="size-4" />
            </Dialog.Close>
          </div>
          <div
            role="status"
            aria-live="polite"
            className="px-4 pt-3 text-xs text-muted-foreground"
          >
            {error
              ? "搜索索引加载失败，请刷新页面后重试。"
              : pending
                ? "正在搜索…"
                : query.trim()
                  ? `${ordered.length} 条结果`
                  : "输入关键词，探索全站内容"}
          </div>
          {query.trim() && !ordered.length && !pending && !error ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">
              没有找到相关内容，试试更短的词语，或从下方入口开始。
            </p>
          ) : null}
          <div
            role="listbox"
            id={`${id}-results`}
            aria-label="搜索结果"
            aria-busy={pending}
            className="min-h-0 overflow-y-auto overscroll-contain px-2 py-3"
          >
            {items.map((item, index) => {
              const group = searchGroup(item.url)
              return (
                <div key={item.url}>
                  {index === 0 ||
                  searchGroup(items[index - 1]?.url ?? "") !== group ? (
                    <div
                      aria-hidden
                      className="mx-2 mt-2 mb-1 bg-hatch px-2 py-1 font-mono text-xs text-muted-foreground"
                    >
                      {group}
                    </div>
                  ) : null}
                  <a
                    href={item.url}
                    tabIndex={-1}
                    id={`${id}-result-${index}`}
                    role="option"
                    aria-selected={index === active}
                    onMouseMove={() => setSelected(index)}
                    onClick={(event) => {
                      if (
                        !event.metaKey &&
                        !event.ctrlKey &&
                        !event.shiftKey &&
                        !event.altKey
                      ) {
                        event.preventDefault()
                        navigate(item.url)
                      }
                    }}
                    className={`mx-1 block cursor-pointer rounded-md px-3 py-3 ${index === active ? "bg-muted" : "hover:bg-muted/60"}`}
                  >
                    <div className="flex items-center justify-between gap-3 text-sm font-medium">
                      <span>
                        <Highlight text={item.title} query={query} />
                      </span>
                      <ArrowUpRightIcon
                        aria-hidden
                        className="size-3.5 shrink-0 text-muted-foreground"
                      />
                    </div>
                    <p className="mt-1 text-xs leading-6 break-words text-foreground/75">
                      <Highlight text={item.snippet} query={query} />
                    </p>
                  </a>
                </div>
              )
            })}
          </div>
          <div className="screen-line-top flex shrink-0 justify-between gap-2 px-4 py-3 font-mono text-[10px] text-muted-foreground">
            <span>↑ ↓ 选择 · ↵ 打开</span>
            <span>Esc 关闭</span>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
