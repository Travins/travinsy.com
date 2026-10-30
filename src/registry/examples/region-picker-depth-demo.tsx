"use client"

import * as React from "react"

import { RegionPicker } from "@/registry/ui/region-picker/region-picker"

const loadRegions = () =>
  import("@/registry/lib/china-regions").then((m) => m.chinaRegions)

/**
 * `depth={2}` 只选到省市，到了第二级的节点就是末级；
 * `allowPartial` 允许停在中间层级，浏览到上级后底部出现确认按钮。
 */
export default function RegionPickerDepthDemo() {
  const [city, setCity] = React.useState<string | null>("440300")
  const [area, setArea] = React.useState<string | null>("330000")

  return (
    <div className="flex w-full max-w-xs flex-col gap-5 rounded-xl border border-edge bg-background p-5 shadow-sm">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="region-depth-city" className="text-sm font-medium">
          所在城市
          <span className="ml-2 font-mono text-[11px] font-normal text-muted-foreground">
            depth=2
          </span>
        </label>
        <RegionPicker
          id="region-depth-city"
          regions={loadRegions}
          depth={2}
          value={city}
          onValueChange={setCity}
        />
        <p className="font-mono text-[11px] text-muted-foreground">
          value = {JSON.stringify(city)}
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="region-depth-area" className="text-sm font-medium">
          服务范围
          <span className="ml-2 font-mono text-[11px] font-normal text-muted-foreground">
            allowPartial
          </span>
        </label>
        <RegionPicker
          id="region-depth-area"
          regions={loadRegions}
          allowPartial
          value={area}
          onValueChange={setArea}
        />
        <p className="font-mono text-[11px] text-muted-foreground">
          value = {JSON.stringify(area)}
        </p>
      </div>
    </div>
  )
}
