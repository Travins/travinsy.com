"use client"

import * as React from "react"
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react"

import { SegmentedControl } from "@/registry/ui/segmented-control/segmented-control"

const ALIGN_OPTIONS = [
  { value: "left", label: "左", icon: <AlignLeft /> },
  { value: "center", label: "居中", icon: <AlignCenter /> },
  { value: "right", label: "右", icon: <AlignRight /> },
] as const

const ALIGN_CLASS = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const

/**
 * 标签示例：`label` 画在最左边的格子里，与选项之间隔一条竖线，
 * 同时作为单选组的可访问名称——不再需要额外的 `aria-label`。
 * 下面直接把对齐方式套在段落上，看得见这一行确实在起作用。
 */
export default function SegmentedControlLabelDemo() {
  const [align, setAlign] = React.useState<string>("left")

  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <SegmentedControl
        label="对齐"
        options={ALIGN_OPTIONS}
        value={align}
        onValueChange={setAlign}
      />
      <div className="mt-3 rounded-lg border border-edge bg-muted/20 p-3">
        <p
          className={`text-xs leading-6 text-muted-foreground ${ALIGN_CLASS[align as keyof typeof ALIGN_CLASS]}`}
        >
          线条网格把内容区切成固定的几栏，文字贴着栏边排布时，
          整页的重心才会落在同一根竖线上。
        </p>
      </div>
    </div>
  )
}
