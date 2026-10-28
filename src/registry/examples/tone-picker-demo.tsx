"use client"

import * as React from "react"
import { Check, Share2 } from "lucide-react"

import { flowToneStyle } from "@/registry/ui/flow-diagram/tone"
import { TonePicker, toneOptions } from "@/registry/ui/tone-picker/tone-picker"

// 内置色调里取五个，色点排一行刚好
const TONES = toneOptions(["primary", "blue", "green", "amber", "violet"])

/**
 * 默认示例：给发布卡片挑强调色。色点换一个，下面卡片上的竖条、图标块、进度与徽章立刻跟着换，
 * 预览区自己拿 `--flow-tone` 取色，与色点用的是同一份主题变量。
 */
export default function TonePickerDemo() {
  const [tone, setTone] = React.useState("violet")

  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <TonePicker
        label="强调色"
        options={TONES}
        value={tone}
        onValueChange={setTone}
      />
      <div
        className="relative mt-3 overflow-hidden rounded-lg border border-edge bg-muted/20"
        style={flowToneStyle(tone)}
      >
        <span
          aria-hidden="true"
          className="absolute inset-y-0 start-0 w-1 bg-(--flow-tone)"
        />
        <div className="p-3 ps-4">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid size-9 shrink-0 place-items-center rounded-lg bg-(--flow-tone)/15 text-(--flow-tone) ring-1 ring-(--flow-tone)/30 ring-inset"
            >
              <Check className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">v2.4.0 已发布</p>
              <p className="truncate text-[11px] text-muted-foreground">
                静态产物已同步到最后一次提交
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-(--flow-tone)/15 px-2 py-0.5 text-[11px] text-foreground ring-1 ring-(--flow-tone)/30 ring-inset dark:bg-(--flow-tone)/25">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-(--flow-tone)"
              />
              稳定版
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
              <span className="block h-full w-3/5 rounded-full bg-(--flow-tone)" />
            </span>
            <span className="shrink-0 font-mono">3 / 5</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex h-7 items-center gap-1 rounded-md border border-edge bg-background px-2.5 text-xs font-medium">
              <Share2 className="size-3.5" aria-hidden="true" />
              分享更新
            </span>
            <span className="text-[11px] text-muted-foreground">24 分钟前</span>
          </div>
        </div>
      </div>
    </div>
  )
}
