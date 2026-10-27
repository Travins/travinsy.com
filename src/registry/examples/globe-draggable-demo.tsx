"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Globe, type GlobeMarker } from "@/registry/ui/globe/globe"

const CITIES = [
  { label: "上海", location: [31.23, 121.47] },
  { label: "新加坡", location: [1.35, 103.82] },
  { label: "法兰克福", location: [50.11, 8.68] },
  { label: "旧金山", location: [37.77, -122.42] },
  { label: "圣保罗", location: [-23.55, -46.63] },
] satisfies GlobeMarker[]

export default function GlobeDraggableDemo() {
  // 点城市就转过去并停住；再点一次取消聚焦，地球恢复自转。拖拽随时可以打断聚焦
  const [active, setActive] = React.useState<string | null>(null)
  const focus = CITIES.find((city) => city.label === active)?.location ?? null

  return (
    <div className="grid w-full max-w-lg items-center gap-6 sm:grid-cols-[minmax(0,1fr)_9rem]">
      <Globe
        draggable
        labels
        markers={CITIES}
        markerTone="primary"
        focus={focus}
        speed={0.15}
      />
      <div className="flex flex-col gap-3">
        <p className="text-xs text-muted-foreground">拖动地球，或点击城市定位</p>
        <ul className="flex flex-wrap gap-2 sm:flex-col">
          {CITIES.map(({ label }) => (
            <li key={label} className="sm:w-full">
              <Button
                size="sm"
                variant={active === label ? "default" : "outline"}
                aria-pressed={active === label}
                onClick={() => setActive(active === label ? null : label)}
                className="sm:w-full sm:justify-start"
              >
                {label}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
