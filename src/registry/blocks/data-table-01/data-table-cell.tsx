"use client"

import * as React from "react"
import { Pencil } from "lucide-react"
import { createPortal } from "react-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import type { DataTableMeta, DataTableLabels } from "./types"

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
  const [pending, setPending] = React.useState(false)
  const [position, setPosition] = React.useState({ left: 0, top: 0 })
  const id = React.useId()
  React.useLayoutEffect(() => {
    if (!error || mobile) return
    function update() {
      const bounds = root.current?.getBoundingClientRect()
      if (bounds)
        setPosition({
          left: Math.max(8, Math.min(bounds.left, window.innerWidth - 248)),
          top: bounds.bottom + 5,
        })
    }
    update()
    window.addEventListener("scroll", update, true)
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update, true)
      window.removeEventListener("resize", update)
    }
  }, [error, mobile])
  const root = React.useRef<HTMLDivElement>(null)
  function start() {
    setDraft(String(value ?? ""))
    setError("")
    setMobile(window.matchMedia("(pointer: coarse)").matches)
    setEditing(true)
  }
  async function commit(direction?: number) {
    const next = meta?.editable === "number" ? Number(draft) : draft
    const message = meta?.validate?.(next, row)
    if (message) {
      setError(message)
      return
    }
    setPending(true)
    try {
      await onCommit(next)
      setEditing(false)
      setError("")
      if (direction !== undefined) {
        const cells = Array.from(
          root.current
            ?.closest("table")
            ?.querySelectorAll<HTMLElement>("[data-editable=true]") ?? [],
        )
        const index = cells.indexOf(root.current!)
        const target =
          direction === 0
            ? cells.slice(index + 1).find((el) => el.dataset.column === cellKey)
            : cells[index + direction]
        requestAnimationFrame(() => target?.focus())
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : labels.saveError)
    } finally {
      setPending(false)
    }
  }
  const input = (
    <Input
      autoFocus
      aria-label={title}
      aria-invalid={!!error}
      aria-describedby={error ? id : undefined}
      type={meta?.editable}
      value={draft}
      disabled={pending}
      className={
        mobile
          ? "min-w-20 focus-visible:ring-0 pointer-coarse:text-base"
          : "absolute inset-0 h-full! min-w-0 rounded-sm py-0 text-sm focus-visible:ring-0 aria-invalid:ring-0"
      }
      onChange={(event) => {
        setDraft(event.target.value)
        setError("")
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setEditing(false)
          setError("")
          root.current?.focus()
        }
        if (event.key === "Enter" || event.key === "Tab") {
          event.preventDefault()
          void commit(event.key === "Enter" ? 0 : event.shiftKey ? -1 : 1)
        }
      }}
    />
  )
  return (
    <div
      ref={root}
      style={{ height: rowHeight - 1 }}
      data-slot="data-table-cell"
      data-editable={!!meta?.editable}
      data-column={cellKey}
      tabIndex={meta?.editable ? 0 : undefined}
      className="group/cell relative flex h-full min-h-0 flex-col justify-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset data-[editable=true]:hover:outline-1 data-[editable=true]:hover:-outline-offset-4 data-[editable=true]:hover:outline-edge data-[editable=true]:hover:outline-dashed"
      onDoubleClick={(event) => {
        if (
          event.currentTarget.contains(event.target as Node) &&
          meta?.editable
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
        if (!event.currentTarget.contains(event.target as Node)) return
        if (!editing && meta?.editable && ["Enter", "F2"].includes(event.key)) {
          event.preventDefault()
          start()
        }
      }}
    >
      {meta?.editable && !editing && (
        <Pencil
          aria-hidden="true"
          className="pointer-events-none absolute top-1 right-1 size-3 text-muted-foreground/50 opacity-0 group-hover/cell:opacity-100"
        />
      )}
      {editing && !mobile ? input : children}
      {error &&
        !mobile &&
        createPortal(
          <p
            id={id}
            role="alert"
            style={{ left: position.left, top: position.top }}
            className="pointer-events-none fixed z-50 max-w-60 rounded-md border border-destructive/40 bg-popover px-3 py-2 text-xs text-destructive shadow-md"
          >
            {error}
          </p>,
          document.body,
        )}
      <Sheet
        open={editing && mobile}
        onOpenChange={(open) => {
          setEditing(open)
          if (!open) setError("")
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
            <p id={id} role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={() => setEditing(false)}
            >
              {labels.cancel}
            </Button>
            <Button
              size="lg"
              className="flex-1"
              disabled={pending}
              onClick={() => void commit()}
            >
              {labels.save}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
export { DataTableCell }
