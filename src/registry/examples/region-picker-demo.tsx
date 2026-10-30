"use client"

import * as React from "react"
import { MapPin } from "lucide-react"

import { RegionPicker } from "@/registry/ui/region-picker/region-picker"

// 放在组件外保持引用稳定；import() 让约 200KB 的数据单独成块，首次需要时才下载
const loadRegions = () =>
  import("@/registry/lib/china-regions").then((m) => m.chinaRegions)

/** 默认示例：有初始值，挂载后就加载数据并显示完整路径；打开后可搜 hz、hangzhou、330106。 */
export default function RegionPickerDemo() {
  const [code, setCode] = React.useState<string | null>("330106")

  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-2 pb-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">收货地址</p>
          <p className="truncate text-xs text-muted-foreground">
            按省、市、区三步选择，也可以直接搜拼音
          </p>
        </div>
        <p className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
          {code ?? "—"}
        </p>
      </div>
      <RegionPicker
        label="所在地区"
        regions={loadRegions}
        value={code}
        onValueChange={setCode}
      />
      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <MapPin className="size-3" aria-hidden="true" />
        值只存最末一级的代码，右上角就是它
      </p>
    </div>
  )
}
