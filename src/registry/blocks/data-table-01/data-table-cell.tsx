"use client"

import * as React from "react"
import { Check, CircleAlert, LoaderCircle, Pencil } from "lucide-react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import type { DataTableMeta, DataTableLabels } from "./types"

type Phase = "idle" | "saving" | "saved" | "failed"

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      data-slot="data-table-cell-key"
      className="inline-flex h-4 min-w-4 items-center justify-center rounded-[3px] border border-b-2 border-edge bg-background px-1 font-mono text-[10px] leading-none text-foreground"
    >
      {children}
    </kbd>
  )
}

/**
 * 可编辑单元格。编辑采用表格软件的习惯：
 * - 编辑框就地替换内容，整格描主色实线框，下方贴一条提示条（快捷键 / 校验错误）
 * - Enter、Tab、点击别处都会保存；值没变直接退出；Esc 放弃
 * - 保存是乐观的：编辑框立刻关闭，格子右上角依次显示 保存中 → 已保存（淡出）
 * - 保存失败时值回滚，格子角标变红并保留草稿，再次编辑会带回草稿和错误
 */
function DataTableCell<T>({
  value,
  row,
  meta,
  title,
  labels,
  onCommit,
  children,
  cellKey,
  rowHeight,
}: {
  value: unknown
  row: T
  meta?: DataTableMeta<T>
  title: string
  labels: DataTableLabels
  onCommit: (value: unknown) => void | Promise<void>
  children: React.ReactNode
  cellKey: string
  rowHeight: number
}) {
  const [editing, setEditing] = React.useState(false)
  const [mobile, setMobile] = React.useState(false)
  const [draft, setDraft] = React.useState("")
  const [error, setError] = React.useState("")
  const [phase, setPhase] = React.useState<Phase>("idle")
  const [failed, setFailed] = React.useState<{
    draft: string
    message: string
  } | null>(null)
  const [hovered, setHovered] = React.useState(false)
  const [focused, setFocused] = React.useState(false)
  const [position, setPosition] = React.useState({ left: 0, top: 0 })
  const root = React.useRef<HTMLDivElement>(null)
  // 关闭编辑框时输入框卸载会触发 blur，用它避免重复保存
  const closing = React.useRef(false)
  const id = React.useId()
  const numeric = meta?.editable === "number"
  const peek = hovered || focused
  const hint = editing || (phase === "failed" && peek)

  React.useLayoutEffect(() => {
    if (!hint || mobile) return
    function update() {
      // 提示条贴住整格（td）的左下角，而不是内容区
      const bounds = (
        root.current?.closest("td") ?? root.current
      )?.getBoundingClientRect()
      if (bounds)
        setPosition({
          left: Math.max(8, Math.min(bounds.left, window.innerWidth - 328)),
          top: bounds.bottom - 1,
        })
    }
    update()
    window.addEventListener("scroll", update, true)
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update, true)
      window.removeEventListener("resize", update)
    }
  }, [hint, mobile])

  React.useEffect(() => {
    if (phase !== "saved") return
    const timer = setTimeout(() => setPhase("idle"), 1600)
    return () => clearTimeout(timer)
  }, [phase])

  function start() {
    closing.current = false
    setDraft(failed?.draft ?? String(value ?? ""))
    setError(failed?.message ?? "")
    setMobile(window.matchMedia("(pointer: coarse)").matches)
    setEditing(true)
  }

  function close(direction?: number) {
    closing.current = true
    setEditing(false)
    setError("")
    if (mobile) return
    const cells = Array.from(
      root.current
        ?.closest("table")
        ?.querySelectorAll<HTMLElement>("[data-editable=true]") ?? [],
    )
    const index = cells.indexOf(root.current!)
    const target =
      direction === undefined
        ? undefined
        : direction === 0
          ? cells.slice(index + 1).find((el) => el.dataset.column === cellKey)
          : cells[index + direction]
    requestAnimationFrame(() => (target ?? root.current)?.focus())
  }

  function cancel() {
    if (failed) {
      setFailed(null)
      setPhase("idle")
    }
    close()
  }

  async function commit(direction?: number, blur = false) {
    if (closing.current) return
    const text = draft.trim()
    const next = numeric
      ? text === ""
        ? Number.NaN
        : Number(text.replace(/,/g, ""))
      : draft
    // 值没变：直接退出，不发请求
    if (!failed && String(next) === String(value ?? "")) {
      if (blur) {
        closing.current = true
        setEditing(false)
      } else close(direction)
      return
    }
    const message = meta?.validate?.(next, row)
    if (message) {
      setError(message)
      return
    }
    if (blur) {
      closing.current = true
      setEditing(false)
    } else close(direction)
    setFailed(null)
    setPhase("saving")
    try {
      await onCommit(next)
      setPhase("saved")
    } catch (reason) {
      setFailed({
        draft,
        message: reason instanceof Error ? reason.message : labels.saveError,
      })
      setPhase("failed")
    }
  }

  const input = (
    <Input
      autoFocus
      aria-label={title}
      aria-invalid={!!error}
      aria-describedby={error ? id : undefined}
      type="text"
      inputMode={numeric ? "decimal" : undefined}
      autoComplete="off"
      value={draft}
      className={
        mobile
          ? cn("min-w-20 pointer-coarse:text-base", numeric && "font-mono")
          : cn(
              "absolute inset-0 h-full! min-w-0 rounded-none border-0 bg-transparent! px-0 py-0 shadow-none focus-visible:ring-0 aria-invalid:ring-0",
              numeric && "text-right font-mono tabular-nums",
            )
      }
      onFocus={(event) => event.currentTarget.select()}
      onChange={(event) => {
        setDraft(event.target.value)
        setError("")
      }}
      onBlur={() => {
        if (!mobile) void commit(undefined, true)
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault()
          cancel()
        }
        if (!mobile && (event.key === "Enter" || event.key === "Tab")) {
          event.preventDefault()
          void commit(event.key === "Enter" ? 0 : event.shiftKey ? -1 : 1)
        }
        if (mobile && event.key === "Enter") {
          event.preventDefault()
          void commit()
        }
      }}
    />
  )

  const message = error || (!editing && failed?.message)

  return (
    <div
      ref={root}
      style={{ height: rowHeight - 1 }}
      data-slot="data-table-cell"
      data-editable={!!meta?.editable}
      data-editing={(editing && !mobile) || undefined}
      data-state={phase === "idle" ? undefined : phase}
      data-column={cellKey}
      tabIndex={meta?.editable ? 0 : undefined}
      aria-describedby={phase === "failed" && peek ? id : undefined}
      className={cn(
        // 键盘焦点框与编辑框同形：盖住整格，像表格软件的活动单元格
        "group/cell relative flex h-full min-h-0 flex-col justify-center rounded-sm outline-none before:pointer-events-none before:absolute before:-inset-x-3 before:inset-y-0 before:ring-ring before:ring-inset focus-visible:before:ring-2",
        "data-[editable=true]:not-data-editing:hover:outline-1 data-[editable=true]:not-data-editing:hover:-outline-offset-4 data-[editable=true]:not-data-editing:hover:outline-edge data-[editable=true]:not-data-editing:hover:outline-dashed",
        "data-[state=failed]:outline-1 data-[state=failed]:-outline-offset-4 data-[state=failed]:outline-destructive/60! data-[state=failed]:outline-dashed",
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={(event) => setFocused(event.target === event.currentTarget)}
      onBlur={() => setFocused(false)}
      onDoubleClick={(event) => {
        if (
          event.currentTarget.contains(event.target as Node) &&
          meta?.editable &&
          !editing
        )
          start()
      }}
      onClick={(event) => {
        // Sheet 通过 Portal 渲染，面板事件不能冒泡成表格单元格的再次编辑。
        if (!event.currentTarget.contains(event.target as Node)) return
        if (
          !editing &&
          meta?.editable &&
          window.matchMedia("(pointer: coarse)").matches
        )
          start()
      }}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return
        if (!editing && meta?.editable && ["Enter", "F2"].includes(event.key)) {
          event.preventDefault()
          start()
        }
      }}
    >
      {editing && !mobile ? (
        <>
          {/* 主色实线框盖住整格（含 td 内边距），表明这一格正在编辑 */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-3 inset-y-0 z-10 bg-background ring-2 ring-primary ring-inset"
          />
          <span className="absolute inset-0 z-10">{input}</span>
        </>
      ) : (
        <div
          className={cn(
            "min-w-0 transition-opacity",
            phase === "saving" && "opacity-50",
          )}
        >
          {children}
        </div>
      )}

      {/* 右上角状态：悬停可编辑 / 保存中 / 已保存（淡出）/ 失败 */}
      {!editing && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1 -right-2 flex size-3 items-center justify-center"
        >
          {phase === "saving" ? (
            <LoaderCircle className="size-3 animate-spin text-muted-foreground motion-reduce:animate-none" />
          ) : phase === "saved" ? (
            <Check className="size-3 animate-out text-(--flow-green) delay-1000 duration-500 fade-out-0 fill-mode-forwards" />
          ) : phase === "failed" ? (
            <CircleAlert className="size-3 text-destructive" />
          ) : meta?.editable ? (
            <Pencil className="size-3 text-muted-foreground/50 opacity-0 group-hover/cell:opacity-100" />
          ) : null}
        </span>
      )}
      <span className="sr-only" aria-live="polite">
        {phase === "saving"
          ? labels.saving
          : phase === "saved"
            ? labels.saved
            : ""}
      </span>

      {hint &&
        !mobile &&
        createPortal(
          <div
            id={id}
            role={message ? "alert" : undefined}
            style={{ left: position.left, top: position.top }}
            className={cn(
              "pointer-events-none fixed z-50 flex max-w-80 items-center gap-2 rounded-b-md border border-t-0 px-2 py-1 text-xs shadow-sm",
              message
                ? "border-destructive/40 bg-popover text-destructive"
                : "border-edge bg-popover text-muted-foreground",
            )}
          >
            {message ? (
              <>
                <CircleAlert aria-hidden="true" className="size-3.5 shrink-0" />
                <span className="min-w-0 truncate">{message}</span>
                {!editing && (
                  <span className="shrink-0 text-muted-foreground">
                    · <Key>↵</Key> {labels.editAgain}
                  </span>
                )}
              </>
            ) : (
              <span className="flex items-center gap-3 whitespace-nowrap">
                <span className="flex items-center gap-1">
                  <Key>↵</Key>
                  {labels.save}
                </span>
                <span className="flex items-center gap-1">
                  <Key>Tab</Key>
                  {labels.nextCell}
                </span>
                <span className="flex items-center gap-1">
                  <Key>Esc</Key>
                  {labels.cancel}
                </span>
              </span>
            )}
          </div>,
          document.body,
        )}

      <Sheet
        open={editing && mobile}
        onOpenChange={(open) => {
          if (!open) cancel()
        }}
      >
        <SheetContent
          side="bottom"
          className="space-y-4 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        >
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            {labels.editDescription(String(value ?? ""), title)}
          </SheetDescription>
          {editing && mobile && input}
          {error && mobile && (
            <p
              id={id}
              role="alert"
              className="flex items-center gap-1.5 text-sm text-destructive"
            >
              <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={cancel}
            >
              {labels.cancel}
            </Button>
            <Button size="lg" className="flex-1" onClick={() => void commit()}>
              {labels.save}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
export { DataTableCell }
