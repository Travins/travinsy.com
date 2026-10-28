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
import { ValueSlider } from "@/registry/ui/value-slider/value-slider"
import { XyPad } from "@/registry/ui/xy-pad/xy-pad"

type View = { yaw: number; pitch: number; perspective: number }

const DEFAULTS: View = { yaw: -32, pitch: 18, perspective: 900 }

/** 立方体的六个面：同一色调配不同深浅，转到任何角度都能分清前后 */
const FACES = [
  { name: "front", tint: 20, transform: "translateZ(4rem)" },
  { name: "back", tint: 5, transform: "rotateY(180deg) translateZ(4rem)" },
  { name: "right", tint: 34, transform: "rotateY(90deg) translateZ(4rem)" },
  { name: "left", tint: 26, transform: "rotateY(-90deg) translateZ(4rem)" },
  { name: "top", tint: 9, transform: "rotateX(90deg) translateZ(4rem)" },
  { name: "bottom", tint: 5, transform: "rotateX(-90deg) translateZ(4rem)" },
] as const

const degrees = (value: number) => `${value}°`
const pixels = (value: number) => `${value}px`

/**
 * 示例：把二维拖拽板放进控制面板当「视角」——横轴转朝向、纵轴转俯仰，两者一起调出任意机位；
 * 下面一条数值滑块单独控制透视距离。面板标题栏可以把当前视角复制成一段 JSX。
 */
export default function XyPadViewDemo() {
  const [view, setView] = React.useState<View>(DEFAULTS)
  const set = (patch: Partial<View>) =>
    setView((current) => ({ ...current, ...patch }))

  /** 只把改过的项写进代码 */
  const code = () => {
    const props: Record<string, unknown> = {}
    if (view.yaw !== DEFAULTS.yaw) props.yaw = view.yaw
    if (view.pitch !== DEFAULTS.pitch) props.pitch = view.pitch
    if (view.perspective !== DEFAULTS.perspective)
      props.perspective = view.perspective
    return formatJsx("Cube", props)
  }

  return (
    <div className="@container w-full max-w-xl">
      <div className="grid overflow-hidden rounded-xl border border-edge bg-background shadow-xs @min-[32rem]:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="relative flex min-h-56 items-center justify-center border-b border-edge bg-muted/20 p-6 @min-[32rem]:border-e @min-[32rem]:border-b-0">
          <div
            role="img"
            aria-label={`立方体，朝向 ${view.yaw}°，俯仰 ${view.pitch}°`}
            className="relative size-32"
            style={{ perspective: `${view.perspective}px` }}
          >
            <div
              className="size-full transition-transform duration-150 ease-out [transform-style:preserve-3d] motion-reduce:transition-none"
              style={{
                transform: `rotateX(${-view.pitch}deg) rotateY(${view.yaw}deg)`,
              }}
            >
              {FACES.map((face) => (
                <span
                  key={face.name}
                  className="absolute inset-0 border border-edge"
                  style={{
                    transform: face.transform,
                    backgroundColor: `color-mix(in oklab, var(--flow-violet) ${face.tint}%, var(--background))`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <ControlPanel className="rounded-none border-0">
          <ControlPanelHeader>
            <ControlPanelTitle>视角</ControlPanelTitle>
            <ControlPanelActions>
              <ControlPanelCopy label="复制视角参数" code={code} />
              <ControlPanelReset onClick={() => setView(DEFAULTS)} />
            </ControlPanelActions>
          </ControlPanelHeader>
          <ControlPanelGroup>
            <XyPad
              label="机位"
              tone="violet"
              className="mx-auto w-full max-w-60 @min-[32rem]:max-w-none"
              grid={4}
              value={{ x: view.yaw, y: view.pitch }}
              onValueChange={({ x, y }) => set({ yaw: x, pitch: y })}
              x={{
                min: -60,
                max: 60,
                step: 1,
                label: "朝向",
                format: degrees,
              }}
              y={{
                min: -45,
                max: 45,
                step: 1,
                label: "俯仰",
                format: degrees,
              }}
              modified={
                view.yaw !== DEFAULTS.yaw || view.pitch !== DEFAULTS.pitch
              }
            />
            <ValueSlider
              label="透视"
              tone="violet"
              min={400}
              max={1600}
              step={50}
              largeStep={200}
              value={view.perspective}
              onValueChange={(perspective) => set({ perspective })}
              formatValue={pixels}
              modified={view.perspective !== DEFAULTS.perspective}
            />
          </ControlPanelGroup>
        </ControlPanel>
      </div>
    </div>
  )
}
