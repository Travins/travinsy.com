"use client"
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react"
import { useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** 超过这个行数的代码默认折叠到固定高度（高度见 docs.css 的 .doc-code）。 */
export const COLLAPSE_LINES = 20

/**
 * 代码展示区：children 是已高亮的 <pre>。
 * 长代码折叠到固定高度，底部渐隐遮罩 + 展开按钮；展开后可再收起。
 */
export function CodeView({
  children,
  lines,
  collapse = true,
  className,
}: {
  children: ReactNode
  lines: number
  collapse?: boolean
  className?: string
}) {
  const [expanded, setExpanded] = useState(false)
  const collapsible = collapse && lines > COLLAPSE_LINES
  const collapsed = collapsible && !expanded
  return (
    <div
      data-slot="code-view"
      data-collapsed={collapsed ? "" : undefined}
      className={cn("doc-code relative min-w-0", className)}
    >
      {children}
      {collapsed && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-28 items-end justify-center bg-gradient-to-t from-background from-25% via-background/70 to-transparent pb-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-expanded={false}
            onClick={() => setExpanded(true)}
            className="pointer-events-auto bg-background"
          >
            <ChevronsUpDown aria-hidden="true" />
            展开代码
          </Button>
        </div>
      )}
      {collapsible && expanded && (
        <div className="flex justify-center border-t border-edge py-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-expanded
            onClick={() => setExpanded(false)}
            className="text-muted-foreground"
          >
            <ChevronsDownUp aria-hidden="true" />
            收起代码
          </Button>
        </div>
      )}
    </div>
  )
}
