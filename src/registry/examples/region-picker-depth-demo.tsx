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
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-2 pb-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">门店设置</p>
          <p className="truncate text-xs text-muted-foreground">
            城市只选到市，服务范围可以停在省
          </p>
        </div>
        <p className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
          depth · partial
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <RegionPicker
          label="所在城市"
          regions={loadRegions}
          depth={2}
          value={city}
          onValueChange={setCity}
        />
        <RegionPicker
          label="服务范围"
          regions={loadRegions}
          allowPartial
          value={area}
          onValueChange={setArea}
        />
      </div>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 font-mono text-[11px] text-muted-foreground">
        <dt>depth=2</dt>
        <dd>value = {JSON.stringify(city)}</dd>
        <dt>allowPartial</dt>
        <dd>value = {JSON.stringify(area)}</dd>
      </dl>
    </div>
  )
}
