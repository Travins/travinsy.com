"use client"

import { useState, type ReactNode } from "react"
import { MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

/** < md：吸顶的「菜单」按钮条，点开后从左侧滑出完整文档导航。 */
export function DocsMobileNav({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="docs-mobile-bar">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="-ml-2 gap-2 text-[13px]"
            />
          }
        >
          <MenuIcon />
          菜单
        </SheetTrigger>
        <SheetContent side="left" className="w-72 gap-0">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription className="sr-only">
              选择要阅读的文档页面
            </SheetDescription>
          </SheetHeader>
          {/* 点击任意链接后收起抽屉 */}
          <div
            className="min-h-0 flex-1 overflow-y-auto px-4 pb-6"
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("a")) setOpen(false)
            }}
          >
            {children}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
