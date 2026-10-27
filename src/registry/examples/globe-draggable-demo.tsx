"use client"

import * as React from "react"
import { MousePointer2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Globe, type GlobeMarker } from "@/registry/ui/globe/globe"

const CITIES: GlobeMarker[] = [
  { label: "上海", location: [31.23, 121.47] },
  { label: "新加坡", location: [1.35, 103.82] },
  { label: "法兰克福", location: [50.11, 8.68] },
  { label: "旧金山", location: [37.77, -122.42] },
  { label: "圣保罗", location: [-23.55, -46.63] },
]

export default function GlobeDraggableDemo() {
  // 点城市就转过去并停住；再点一次取消聚焦，地球恢复自转。拖拽随时可以打断聚焦
  const [active, setActive] = React.useState<string | null>(null)
  const focus = CITIES.find((city) => city.label === active)?.location ?? null

  return (
    <div className="grid w-full max-w-3xl items-center gap-6 rounded-lg border border-edge bg-card p-5 sm:grid-cols-[minmax(0,1fr)_14rem] sm:p-6">
      <div className="relative">
        <Globe
          draggable
          labels
          markers={CITIES}
          markerTone="primary"
          focus={focus}
          speed={0.15}
          className="mx-auto max-w-sm"
        />
        <p className="absolute bottom-0 left-0 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MousePointer2 className="size-3.5" aria-hidden="true" />
          拖动旋转
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">点击城市定位</p>
        <ul className="flex flex-wrap gap-2 sm:flex-col">
          {CITIES.map((city) => (
            <li key={city.label}>
              <Button
                size="sm"
                variant={active === city.label ? "default" : "outline"}
                aria-pressed={active === city.label}
                onClick={() =>
                  setActive(active === city.label ? null : (city.label ?? null))
                }
                className="w-full justify-start"
              >
                {city.label}
                <span className="ml-auto font-mono text-[10px] opacity-60">
                  {city.location[0].toFixed(0)}°, {city.location[1].toFixed(0)}°
                </span>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
