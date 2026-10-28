"use client"

import * as React from "react"
import { Tag } from "lucide-react"

import { flowToneStyle, type FlowTone } from "@/registry/ui/flow-diagram/tone"
import { TonePicker } from "@/registry/ui/tone-picker/tone-picker"

/**
 * 自定义选项：`tone` 写内置色调名，也可以写任意 CSS 颜色（这里用主题变量，不写死色值）；
 * `tone: null` 画成虚线空心圆，表示「跟着上级走」。
 */
const OPTIONS = [
  { value: "inherit", label: "跟随上级", tone: null },
  { value: "primary", label: "主题色", tone: "primary" as FlowTone },
  { value: "blue", label: "蓝", tone: "blue" as FlowTone },
  { value: "rose", label: "玫红", tone: "rose" as FlowTone },
  { value: "mint", label: "青绿（主题变量）", tone: "var(--flow-cyan)" },
] as const

/**
 * 自定义选项示例：标签的强调色。选「跟随上级」时标签退回中性灰，
 * 其余选项用各自的色点；最后一个用 `var(--flow-cyan)` 演示任意 CSS 颜色也能当色点。
 */
export default function TonePickerCustomDemo() {
  const [tone, setTone] = React.useState<string>("inherit")
  const inherited = tone === "inherit"

  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-2 pb-3">
        <p className="text-sm font-medium">标签样式</p>
        <p className="text-xs text-muted-foreground">v2.4.0</p>
      </div>
      <TonePicker
        label="强调色"
        options={OPTIONS}
        value={tone}
        onValueChange={setTone}
      />
      <div className="mt-3 flex flex-wrap items-center gap-1.5 rounded-lg border border-edge bg-muted/20 p-3">
        <span
          className={
            inherited
              ? "inline-flex items-center gap-1 rounded-md border border-edge bg-background px-1.5 py-0.5 text-[11px] text-muted-foreground"
              : "inline-flex items-center gap-1 rounded-md bg-(--flow-tone)/15 px-1.5 py-0.5 text-[11px] text-foreground ring-1 ring-(--flow-tone)/35 ring-inset dark:bg-(--flow-tone)/25"
          }
          style={inherited ? undefined : flowToneStyle(tone)}
        >
          <Tag className="size-3" aria-hidden="true" />
          {inherited ? "跟随上级" : "已上线"}
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
          <Tag className="size-3" aria-hidden="true" />
          文档
        </span>
        <p className="w-full pt-1 text-[11px] text-muted-foreground">
          {inherited
            ? "没有自己的颜色，用上级容器的样式。"
            : "这一枚标签有了自己的强调色。"}
        </p>
      </div>
    </div>
  )
}
