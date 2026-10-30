"use client"

import * as React from "react"

import { RegionPicker } from "@/registry/ui/region-picker/region-picker"

// 放在组件外保持引用稳定；import() 让约 200KB 的数据单独成块，首次需要时才下载
const loadRegions = () =>
  import("@/registry/lib/china-regions").then((m) => m.chinaRegions)

/** 默认示例：有初始值，挂载后就加载数据并显示完整路径；打开后可搜 hz、hangzhou、330106。 */
export default function RegionPickerDemo() {
  const [code, setCode] = React.useState<string | null>("330106")

  return (
    <div className="flex w-full max-w-sm flex-col gap-1.5">
      <label htmlFor="region-picker-demo" className="text-sm font-medium">
        所在地区
      </label>
      <RegionPicker
        id="region-picker-demo"
        regions={loadRegions}
        value={code}
        onValueChange={setCode}
      />
      <p className="font-mono text-[11px] text-muted-foreground">
        value = {JSON.stringify(code)}
      </p>
    </div>
  )
}
