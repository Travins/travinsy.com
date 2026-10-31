"use client"

import * as React from "react"
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react"

import { SegmentedControl } from "@/registry/ui/segmented-control/segmented-control"

const ALIGN_OPTIONS = [
  { value: "left", label: "左对齐", icon: <AlignLeft /> },
  { value: "center", label: "居中", icon: <AlignCenter /> },
  { value: "right", label: "右对齐", icon: <AlignRight /> },
  { value: "justify", label: "两端对齐", icon: <AlignJustify /> },
] as const

const ALIGN_CLASS = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
} as const

/**
 * 纯图标：`iconOnly` 让每格变成正方形、图标居中，
 * `label` 只给读屏并作为悬停提示，整组名称用 `aria-label`。
 */
export default function SegmentedControlIconDemo() {
  const [align, setAlign] = React.useState<string>("left")

  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <SegmentedControl
        aria-label="对齐方式"
        iconOnly
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
