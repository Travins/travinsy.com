"use client"

import * as React from "react"

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
import { flowToneStyle, type FlowTone } from "@/registry/ui/flow-diagram/tone"
import { SegmentedControl } from "@/registry/ui/segmented-control/segmented-control"
import { TonePicker, toneOptions } from "@/registry/ui/tone-picker/tone-picker"
import { ToggleSwitch } from "@/registry/ui/toggle-switch/toggle-switch"
import { ValueSlider } from "@/registry/ui/value-slider/value-slider"

/** 名片卡的可调参数；默认值同时用来判断哪几项改过（复制的代码只写改动过的属性） */
type CardConfig = {
  radius: number
  padding: number
  elevation: number
  layout: "row" | "column"
  tone: FlowTone
  border: boolean
}

const DEFAULTS: CardConfig = {
  radius: 14,
  padding: 20,
  elevation: 28,
  layout: "row",
  tone: "violet",
  border: true,
}

const KEYS = Object.keys(DEFAULTS) as (keyof CardConfig)[]

const LAYOUT_OPTIONS = [
  { value: "row", label: "横排" },
  { value: "column", label: "竖排" },
] as const

// 名片卡只用五个色调，色点少一些更好点
const TONE_OPTIONS = toneOptions([
  "primary",
  "blue",
  "violet",
  "amber",
  "green",
])

const formatPx = (value: number) => `${value}px`
const formatPercent = (value: number) => `${value}%`

/** 阴影深度换算成 `box-shadow`：越深抬得越高、散得越开、也越浓 */
function elevationShadow(elevation: number) {
  if (elevation <= 0) return "none"
  const y = Math.round(elevation / 9)
  const blur = Math.round(elevation / 1.6)
  const spread = Math.round(elevation / 14)
  const alpha = Math.round(elevation / 3.2)
  return `0 ${y}px ${blur}px ${spread}px color-mix(in oklab, var(--foreground) ${alpha}%, transparent)`
}

/** 只把改过的属性写进代码；一个都没改时是一句自闭合标签 */
function buildCode(config: CardConfig) {
  const props: Record<string, unknown> = {}
  for (const key of KEYS) {
    if (config[key] !== DEFAULTS[key]) props[key] = config[key]
  }
  return formatJsx("ProfileCard", props)
}

/** 被调的那张名片：圆角、内边距、阴影、色调、朝向、边框全部来自面板 */
function ProfileCard({ config }: { config: CardConfig }) {
  const row = config.layout === "row"
  return (
    <div
      className="w-full max-w-60"
      style={{
        ...flowToneStyle(config.tone),
        borderRadius: config.radius,
        padding: config.padding,
        boxShadow: elevationShadow(config.elevation),
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: config.border
          ? "color-mix(in oklab, var(--flow-tone) 34%, var(--edge))"
          : "transparent",
        backgroundColor:
          "color-mix(in oklab, var(--flow-tone) 6%, var(--background))",
      }}
    >
      <div
        className={
          row
            ? "flex items-center gap-3"
            : "flex flex-col items-center gap-2 text-center"
        }
      >
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-full text-sm font-medium text-(--flow-tone)"
          style={{
            backgroundColor:
              "color-mix(in oklab, var(--flow-tone) 16%, var(--background))",
            boxShadow:
              "inset 0 0 0 1px color-mix(in oklab, var(--flow-tone) 34%, transparent)",
          }}
        >
          易
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">林知远</p>
          <p className="truncate text-xs text-muted-foreground">
            产品设计师 · 杭州
          </p>
        </div>
      </div>
      <div
        className={
          row
            ? "mt-3 flex flex-wrap items-center gap-1.5"
            : "mt-3 flex flex-wrap items-center justify-center gap-1.5"
        }
      >
        <span className="inline-flex items-center gap-1 rounded-full border border-edge bg-background/60 px-2 py-0.5 text-[11px] text-muted-foreground">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-(--flow-tone)"
          />
          可接新项目
        </span>
        <span className="rounded-full border border-edge bg-background/60 px-2 py-0.5 text-[11px] text-muted-foreground">
          作品 24
        </span>
      </div>
    </div>
  )
}

/**
 * 默认示例：左边一张实时预览的名片卡，右边是控制面板本体——三个可输入的数值滑块、
 * 布局与色调的选择、一个开关，全部用默认的 `bar` 高度（32px）排进一列，方便点按。
 * 面板里的控件也跟着当前色调着色，换一个色点，预览和面板一起变；
 * 改过的项标上 `modified`，标题栏的复制按钮把当前参数写成 JSX。
 */
export default function ControlPanelDemo() {
  const [config, setConfig] = React.useState<CardConfig>(DEFAULTS)
  const set = (patch: Partial<CardConfig>) =>
    setConfig((current) => ({ ...current, ...patch }))
  const isModified = (key: keyof CardConfig) => config[key] !== DEFAULTS[key]

  return (
    // 用容器查询而不是视口断点：列表缩略图里这块只有 300 多像素宽，不能跟着视口分成两栏
    <div className="@container w-full max-w-2xl">
      <div className="grid overflow-hidden rounded-xl border border-edge bg-background @min-[30rem]:grid-cols-[minmax(0,1fr)_17rem]">
        <div
          className="relative flex min-h-44 items-center justify-center border-b border-edge bg-muted/20 p-6 @min-[30rem]:border-e @min-[30rem]:border-b-0"
          // 预览区底下一层当前色调的光晕，换色调时整块跟着变
          style={{
            ...flowToneStyle(config.tone),
            backgroundImage:
              "radial-gradient(circle at 50% 45%, color-mix(in oklab, var(--flow-tone) 16%, transparent), transparent 70%)",
          }}
        >
          <ProfileCard config={config} />
        </div>
        <ControlPanel className="rounded-none border-0">
          <ControlPanelHeader>
            <ControlPanelTitle>名片卡</ControlPanelTitle>
            <ControlPanelActions>
              <ControlPanelCopy
                label="复制名片卡参数"
                code={() => buildCode(config)}
              />
              <ControlPanelReset onClick={() => setConfig(DEFAULTS)} />
            </ControlPanelActions>
          </ControlPanelHeader>
          <ControlPanelGroup>
            <ValueSlider
              className="text-xs"
              editable
              modified={isModified("radius")}
              tone={config.tone}
              label="圆角"
              min={0}
              max={28}
              value={config.radius}
              onValueChange={(radius) => set({ radius })}
              formatValue={formatPx}
            />
            <ValueSlider
              className="text-xs"
              editable
              modified={isModified("padding")}
              tone={config.tone}
              label="内边距"
              min={8}
              max={32}
              value={config.padding}
              onValueChange={(padding) => set({ padding })}
              formatValue={formatPx}
            />
            <ValueSlider
              className="text-xs"
              editable
              modified={isModified("elevation")}
              tone={config.tone}
              label="阴影"
              min={0}
              max={100}
              value={config.elevation}
              onValueChange={(elevation) => set({ elevation })}
              formatValue={formatPercent}
            />
            <SegmentedControl
              className="text-xs"
              label="布局"
              options={LAYOUT_OPTIONS}
              value={config.layout}
              modified={isModified("layout")}
              tone={config.tone}
              onValueChange={(layout) =>
                set({ layout: layout as CardConfig["layout"] })
              }
            />
            <TonePicker
              className="text-xs"
              label="色调"
              options={TONE_OPTIONS}
              value={config.tone}
              modified={isModified("tone")}
              onValueChange={(tone) => set({ tone: tone as FlowTone })}
            />
            <ToggleSwitch
              className="text-xs"
              label="边框"
              checked={config.border}
              modified={isModified("border")}
              tone={config.tone}
              onCheckedChange={(border) => set({ border })}
            />
          </ControlPanelGroup>
        </ControlPanel>
      </div>
    </div>
  )
}
