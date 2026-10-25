"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function CopyButton({ value }: { value: string }) {
  const [message, setMessage] = useState("复制")
  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={message === "复制" ? "复制代码" : message}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setMessage("已复制")
        } catch {
          setMessage("复制失败，请手动选择")
        }
        setTimeout(() => setMessage("复制"), 2000)
      }}
    >
      <span aria-live="polite">{message}</span>
    </Button>
  )
}
