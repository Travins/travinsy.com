"use client"
import { Check, Copy } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type CopyState = "idle" | "copied" | "failed"

/**
 * 图标复制按钮：成功后图标变对勾 2 秒，结果通过 sr-only 的 aria-live 播报。
 * value 可以是字符串，也可以是在点击时才求值的函数（例如复制整页 Markdown）。
 */
export function CopyButton({
  value,
  label = "复制代码",
  className,
  variant = "ghost",
}: {
  value: string | (() => string)
  label?: string
  className?: string
  variant?: "ghost" | "outline"
}) {
  const [state, setState] = useState<CopyState>("idle")
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(
        typeof value === "function" ? value() : value,
      )
      setState("copied")
    } catch {
      setState("failed")
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setState("idle"), 2000)
  }

  const tip =
    state === "copied" ? "已复制" : state === "failed" ? "复制失败" : label
  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant={variant}
              size="icon-sm"
              aria-label={label}
              onClick={copy}
              className={cn("text-muted-foreground hover:text-foreground", className)}
            />
          }
        >
          {state === "copied" ? (
            <Check aria-hidden="true" />
          ) : (
            <Copy aria-hidden="true" />
          )}
        </TooltipTrigger>
        <TooltipContent>{tip}</TooltipContent>
      </Tooltip>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied"
          ? "已复制"
          : state === "failed"
            ? "复制失败，请手动选择"
            : ""}
      </span>
    </>
  )
}
