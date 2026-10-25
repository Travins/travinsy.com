"use client"

import { useEffect, useRef, useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

type CopyState = "idle" | "copied" | "failed"

/** 带可读标签的复制按钮；状态变化通过 aria-live 播报。 */
export function ThemeCopyButton({
  value,
  label,
  className,
}: {
  value: string
  /** 无障碍名称，例如“复制 CSS 变量” */
  label: string
  className?: string
}) {
  const [state, setState] = useState<CopyState>("idle")
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setState("copied")
    } catch {
      setState("failed")
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setState("idle"), 2000)
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={className}
      aria-label={label}
      onClick={copy}
    >
      {state === "copied" ? (
        <CheckIcon data-icon="inline-start" />
      ) : (
        <CopyIcon data-icon="inline-start" />
      )}
      <span aria-live="polite">
        {state === "copied" ? "已复制" : state === "failed" ? "复制失败" : "复制"}
      </span>
    </Button>
  )
}
