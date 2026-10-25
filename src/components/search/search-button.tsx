"use client"

import dynamic from "next/dynamic"
import { SearchIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const SearchDialog = dynamic(() => import("./search-dialog"))

export function SearchButton() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)

  function openSearch() {
    setMounted(true)
    setOpen(true)
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.isComposing || event.defaultPrevented) return
      const target = event.target as HTMLElement
      const editing = target.closest(
        "input, textarea, select, [contenteditable]:not([contenteditable='false'])",
      )
      if (
        ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") ||
        (event.key === "/" &&
          !editing &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.altKey)
      ) {
        event.preventDefault()
        setMounted(true)
        setOpen((value) => !value)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={openSearch}
        aria-label="搜索全站"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-keyshortcuts="Meta+k Control+k /"
        className="flex h-9 shrink-0 items-center gap-2 rounded-md px-2 text-sm text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring xl:w-52 xl:border xl:border-edge xl:bg-muted/40"
      >
        <SearchIcon className="size-4" aria-hidden />
        <span className="hidden xl:inline">搜索文档…</span>
        <kbd className="ml-auto hidden font-mono text-xs xl:inline">⌘K</kbd>
      </button>
      {mounted ? (
        <SearchDialog open={open} onOpenChange={setOpen} trigger={trigger} />
      ) : null}
    </>
  )
}
