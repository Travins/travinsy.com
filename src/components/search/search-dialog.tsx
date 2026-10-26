"use client"

import { Dialog } from "@base-ui/react/dialog"
import { useRef, type RefObject } from "react"
import { SearchPanel } from "./search-panel"

export default function SearchDialog({
  open,
  onOpenChange,
  trigger,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger: RefObject<HTMLButtonElement | null>
}) {
  const input = useRef<HTMLInputElement>(null)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
        <Dialog.Popup
          initialFocus={input}
          finalFocus={trigger}
          className="fixed top-[12vh] left-1/2 z-50 flex w-[calc(100vw-2rem)] max-w-[640px] origin-top -translate-x-1/2 flex-col overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl transition-[opacity,scale] duration-150 ease-out outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none"
        >
          <Dialog.Title className="sr-only">搜索全站</Dialog.Title>
          <Dialog.Description className="sr-only">
            搜索组件、区块、模板、主题、智能体
            指南与博客。使用上下方向键选择结果，回车打开，Escape 关闭。
          </Dialog.Description>
          <SearchPanel inputRef={input} onClose={() => onOpenChange(false)} />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
