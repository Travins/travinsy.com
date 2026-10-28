"use client"

import * as React from "react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  ControlPanel,
  ControlPanelActions,
  ControlPanelCopy,
  ControlPanelGroup,
  ControlPanelHeader,
  ControlPanelReset,
  ControlPanelTitle,
  formatJsx,
} from "@/registry/ui/control-panel/control-panel"
import { flowToneStyle } from "@/registry/ui/flow-diagram/tone"
import { ValueSlider } from "@/registry/ui/value-slider/value-slider"

type CoverSettings = { width: number; height: number; radius: number }

const DEFAULTS: CoverSettings = { width: 720, height: 480, radius: 12 }
// 一进来就有两项改过但还没应用：左边的预览仍是默认尺寸，下面代码区已经是改过的属性
const INITIAL: CoverSettings = { width: 1080, height: 480, radius: 20 }

const formatPx = (value: number) => `${value}px`

/** 只把改过的项写进代码；`width` 收窄到 24 个字符，演示超出时自动换行 */
function buildCode(settings: CoverSettings) {
  const props: Record<string, unknown> = {}
  for (const key of Object.keys(DEFAULTS) as (keyof CoverSettings)[]) {
    if (settings[key] !== DEFAULTS[key]) props[key] = settings[key]
  }
  return formatJsx("CoverCard", props, { width: 24 })
}

/**
 * 标题栏示例：`ControlPanelActions` 就是一个普通容器，除了复制与恢复，还能放自己的按钮——
 * 这里是「应用」：面板改的是草稿，按下才写进左边的预览，没改动时按钮禁用。
 * 面板下面直接把 `formatJsx` 的输出摊开，能看到多行缩进的样子。
 */
export default function ControlPanelActionsDemo() {
  const [draft, setDraft] = React.useState<CoverSettings>(INITIAL)
  const [applied, setApplied] = React.useState<CoverSettings>(DEFAULTS)
  const dirty =
    draft.width !== applied.width ||
    draft.height !== applied.height ||
    draft.radius !== applied.radius
  const set = (patch: Partial<CoverSettings>) =>
    setDraft((current) => ({ ...current, ...patch }))

  return (
    <div className="w-full max-w-md">
      <div className="flex h-36 items-center justify-center rounded-xl border border-edge bg-muted/20 p-3">
        <div
          className="grid h-full place-items-center bg-(--flow-tone)/12 ring-1 ring-(--flow-tone)/30 ring-inset"
          style={{
            ...flowToneStyle("violet"),
            aspectRatio: `${applied.width} / ${applied.height}`,
            borderRadius: applied.radius,
          }}
        >
          <span className="font-mono text-[11px] text-muted-foreground">
            {applied.width} × {applied.height}
          </span>
        </div>
      </div>
      <ControlPanel className="mt-3">
        <ControlPanelHeader>
          <ControlPanelTitle>封面尺寸</ControlPanelTitle>
          <ControlPanelActions>
            <button
              type="button"
              disabled={!dirty}
              onClick={() => setApplied(draft)}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-xs disabled:opacity-40",
              )}
            >
              应用
            </button>
            <ControlPanelCopy
              label="复制封面参数"
              code={() => buildCode(draft)}
            />
            <ControlPanelReset onClick={() => setDraft(DEFAULTS)} />
          </ControlPanelActions>
        </ControlPanelHeader>
        <ControlPanelGroup>
          <ValueSlider
            variant="compact"
            editable
            label="宽度"
            min={320}
            max={1440}
            step={8}
            largeStep={80}
            value={draft.width}
            modified={draft.width !== DEFAULTS.width}
            onValueChange={(width) => set({ width })}
            formatValue={formatPx}
          />
          <ValueSlider
            variant="compact"
            editable
            label="高度"
            min={240}
            max={1080}
            step={8}
            largeStep={80}
            value={draft.height}
            modified={draft.height !== DEFAULTS.height}
            onValueChange={(height) => set({ height })}
            formatValue={formatPx}
          />
          <ValueSlider
            variant="compact"
            editable
            label="圆角"
            min={0}
            max={48}
            value={draft.radius}
            modified={draft.radius !== DEFAULTS.radius}
            onValueChange={(radius) => set({ radius })}
            formatValue={formatPx}
          />
        </ControlPanelGroup>
      </ControlPanel>
      <div className="mt-2 overflow-x-auto rounded-lg border border-edge bg-muted/30 p-3 font-mono text-[11px] leading-5 whitespace-pre text-muted-foreground">
        {buildCode(draft)}
      </div>
    </div>
  )
}
