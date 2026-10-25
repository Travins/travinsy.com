"use client"
import type { ReactElement, ReactNode } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

/** 给图标按钮 / 图标链接加悬停与聚焦提示；可见文字之外的名称由 aria-label 提供。 */
export function IconTip({
  label,
  children,
}: {
  label: string
  children: ReactElement
}) {
  return (
    <Tooltip>
      <TooltipTrigger render={children}>
        {(children.props as { children?: ReactNode }).children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
