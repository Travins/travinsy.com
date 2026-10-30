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
    <div className="w-full max-w-xs rounded-xl border border-edge bg-background p-5 shadow-sm">
      <p className="text-sm font-medium">收货地址</p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        按省、市、区三步选择，也可以直接搜拼音
      </p>
      <div className="mt-4 flex flex-col gap-1.5">
        <label htmlFor="region-picker-demo" className="text-xs font-medium">
          所在地区
        </label>
        <RegionPicker
          id="region-picker-demo"
          regions={loadRegions}
          value={code}
          onValueChange={setCode}
        />
      </div>
      <p className="mt-3 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
        <span>地区代码</span>
        <span className="tabular-nums">{code ?? "—"}</span>
      </p>
    </div>
  )
}
