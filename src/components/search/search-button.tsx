"use client"

import dynamic from "next/dynamic"
import { SearchIcon } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"

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
        // 与右侧图标按钮同款 ghost 按钮、同为 default 档（32px），悬停底色高度一致
        className={cn(
          buttonVariants({ variant: "ghost", size: "default" }),
          "gap-1.5 px-2 aria-expanded:bg-muted",
        )}
      >
        <SearchIcon className="size-4 shrink-0" aria-hidden />
        <span aria-hidden className="hidden items-center gap-0.5 md:flex">
          {(isMac ? ["⌘", "K"] : ["Ctrl", "K"]).map((key) => (
            <kbd
              key={key}
              className="inline-flex h-5 min-w-5 items-center justify-center rounded-sm bg-foreground/5 px-1 font-sans text-xs text-muted-foreground shadow-[inset_0_0_1px] shadow-foreground/20"
            >
              {key}
            </kbd>
          ))}
        </span>
      </button>
      {mounted ? (
        <SearchDialog open={open} onOpenChange={setOpen} trigger={trigger} />
      ) : null}
    </>
  )
}
