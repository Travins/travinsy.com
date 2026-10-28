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
import { SegmentedControl } from "@/registry/ui/segmented-control/segmented-control"
import { ToggleSwitch } from "@/registry/ui/toggle-switch/toggle-switch"
import { ValueSlider } from "@/registry/ui/value-slider/value-slider"

type Settings = {
  width: number
  height: number
  format: string
  quality: number
  lossless: boolean
  position: string
  opacity: number
}

const DEFAULTS: Settings = {
  width: 1600,
  height: 900,
  format: "webp",
  quality: 82,
  lossless: false,
  position: "center",
  opacity: 60,
}

const FORMAT_OPTIONS = [
  { value: "png", label: "PNG" },
  { value: "webp", label: "WebP" },
  { value: "avif", label: "AVIF" },
] as const

const POSITION_OPTIONS = [
  { value: "corner", label: "右下角" },
  { value: "center", label: "居中" },
  { value: "tile", label: "平铺" },
] as const

const formatPx = (value: number) => `${value}px`
const formatPercent = (value: number) => `${value}%`

/** 只把改过的项写进代码 */
function buildCode(settings: Settings) {
  const props: Record<string, unknown> = {}
  for (const key of Object.keys(DEFAULTS) as (keyof Settings)[]) {
    if (settings[key] !== DEFAULTS[key]) props[key] = settings[key]
  }
  return formatJsx("ImageExport", props)
}

/**
 * 分组示例：三个 `ControlPanelGroup`，各自带小标题，相邻分组之间自动画一条分隔线。
 * `columns={2}` 让两个窄控件并排；一行只放一个控件时用 `sm:col-span-2` 跨满两列。
 */
export default function ControlPanelGroupsDemo() {
  const [settings, setSettings] = React.useState<Settings>(DEFAULTS)
  const set = (patch: Partial<Settings>) =>
    setSettings((current) => ({ ...current, ...patch }))
  const isModified = (key: keyof Settings) => settings[key] !== DEFAULTS[key]

  return (
    <ControlPanel className="w-full max-w-md">
      <ControlPanelHeader>
        <ControlPanelTitle>图片导出</ControlPanelTitle>
        <ControlPanelActions>
          <ControlPanelCopy
            label="复制导出参数"
            code={() => buildCode(settings)}
          />
          <ControlPanelReset onClick={() => setSettings(DEFAULTS)} />
        </ControlPanelActions>
      </ControlPanelHeader>
      <ControlPanelGroup title="画布" columns={2}>
        <ValueSlider
          className="text-xs"
          editable
          label="宽"
          min={320}
          max={2560}
          step={16}
          largeStep={160}
          value={settings.width}
          modified={isModified("width")}
          onValueChange={(width) => set({ width })}
          formatValue={formatPx}
        />
        <ValueSlider
          className="text-xs"
          editable
          label="高"
          min={320}
          max={1440}
          step={16}
          largeStep={160}
          value={settings.height}
          modified={isModified("height")}
          onValueChange={(height) => set({ height })}
          formatValue={formatPx}
        />
      </ControlPanelGroup>
      <ControlPanelGroup title="输出" columns={2}>
        <SegmentedControl
          className="text-xs sm:col-span-2"
          label="格式"
          options={FORMAT_OPTIONS}
          value={settings.format}
          modified={isModified("format")}
          onValueChange={(format) => set({ format })}
        />
        <ValueSlider
          className="text-xs"
          editable
          label="质量"
          min={40}
          max={100}
          value={settings.quality}
          modified={isModified("quality")}
          onValueChange={(quality) => set({ quality })}
          formatValue={formatPercent}
        />
        <ToggleSwitch
          className="text-xs"
          label="无损"
          checked={settings.lossless}
          modified={isModified("lossless")}
          onCheckedChange={(lossless) => set({ lossless })}
        />
      </ControlPanelGroup>
      <ControlPanelGroup title="水印" columns={2}>
        <SegmentedControl
          className="text-xs sm:col-span-2"
          label="位置"
          options={POSITION_OPTIONS}
          value={settings.position}
          modified={isModified("position")}
          onValueChange={(position) => set({ position })}
        />
        <ValueSlider
          className="text-xs sm:col-span-2"
          editable
          label="不透明度"
          min={0}
          max={100}
          value={settings.opacity}
          modified={isModified("opacity")}
          onValueChange={(opacity) => set({ opacity })}
          formatValue={formatPercent}
        />
      </ControlPanelGroup>
    </ControlPanel>
  )
}
