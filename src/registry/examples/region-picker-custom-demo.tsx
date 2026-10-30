"use client"

import * as React from "react"

import {
  RegionPicker,
  type RegionOption,
} from "@/registry/ui/region-picker/region-picker"

/**
 * 自己的数据：只开通了几个城市的配送范围。代码不必是国标码，pinyin 也可以不写
 * （此时搜索只按名称和代码）；层级深浅不一，选到没有 children 的节点即选完。
 */
const DELIVERY_REGIONS: RegionOption[] = [
  {
    code: "SH",
    name: "上海",
    pinyin: "shang hai",
    children: [
      { code: "SH-PD", name: "浦东新区", pinyin: "pu dong xin qu" },
      { code: "SH-XH", name: "徐汇区", pinyin: "xu hui qu" },
      { code: "SH-MH", name: "闵行区", pinyin: "min hang qu" },
    ],
  },
  {
    code: "HZ",
    name: "杭州",
    pinyin: "hang zhou",
    children: [
      { code: "HZ-XH", name: "西湖区", pinyin: "xi hu qu" },
      { code: "HZ-BJ", name: "滨江区", pinyin: "bin jiang qu" },
    ],
  },
  { code: "SZ", name: "苏州", pinyin: "su zhou" },
  {
    code: "CD",
    name: "成都",
    children: [
      { code: "CD-WH", name: "武侯区" },
      { code: "CD-JJ", name: "锦江区" },
    ],
  },
]

/** 第二个选择器演示代码失效：数据里已经没有 "330199"，触发器改显示调用方存下的名称。 */
export default function RegionPickerCustomDemo() {
  const [code, setCode] = React.useState<string | null>("HZ-XH")
  const [saved, setSaved] = React.useState<string | null>("330199")

  return (
    <div className="flex w-full max-w-xs flex-col gap-5 rounded-xl border border-edge bg-background p-5 shadow-sm">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="region-custom-delivery" className="text-sm font-medium">
          配送城市
        </label>
        <RegionPicker
          id="region-custom-delivery"
          regions={DELIVERY_REGIONS}
          placeholder="选择配送区域"
          value={code}
          onValueChange={setCode}
        />
        <p className="font-mono text-[11px] text-muted-foreground">
          value = {JSON.stringify(code)}
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="region-custom-stale" className="text-sm font-medium">
          历史订单地址
          <span className="ml-2 font-mono text-[11px] font-normal text-muted-foreground">
            代码已失效
          </span>
        </label>
        <RegionPicker
          id="region-custom-stale"
          regions={DELIVERY_REGIONS}
          fallbackLabel="某某省 / 某某市（已撤销）"
          value={saved}
          onValueChange={setSaved}
        />
        <p className="font-mono text-[11px] text-muted-foreground">
          value = {JSON.stringify(saved)}
        </p>
      </div>
    </div>
  )
}
