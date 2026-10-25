"use client"

import dynamic from "next/dynamic"
import { SearchIcon } from "lucide-react"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { Kbd } from "@/components/ui/kbd"

const loadDialog = () => import("./search-dialog")
const SearchDialog = dynamic(loadDialog)

const subscribe = () => () => {}

function isMacPlatform() {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } }
  return /mac|iphone|ipad|ipod/i.test(
    nav.userAgentData?.platform || navigator.platform || "",
  )
}

/** 服务端与水合阶段按 Mac 渲染，挂载后再按真实平台修正，避免水合不一致。 */
function useIsMac() {
  return useSyncExternalStore(subscribe, isMacPlatform, () => true)
}

export function SearchButton() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const isMac = useIsMac()

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
        onPointerEnter={loadDialog}
        onFocus={loadDialog}
        aria-label="搜索全站"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-keyshortcuts="Meta+k Control+k /"
        className="flex size-8 shrink-0 items-center justify-center gap-2 rounded-md text-sm text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 xl:w-56 xl:justify-start xl:border xl:border-border xl:bg-muted/40 xl:px-2.5 xl:hover:border-foreground/30 xl:hover:bg-muted/40"
      >
        <SearchIcon className="size-4 shrink-0" aria-hidden />
        <span className="hidden xl:inline">搜索文档…</span>
        <Kbd
          aria-hidden
          className="ml-auto hidden bg-background xl:inline-flex"
        >
          {isMac ? "⌘K" : "Ctrl K"}
        </Kbd>
      </button>
      {mounted ? (
        <SearchDialog open={open} onOpenChange={setOpen} trigger={trigger} />
      ) : null}
    </>
  )
}
