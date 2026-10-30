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
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-2 pb-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">配送范围</p>
          <p className="truncate text-xs text-muted-foreground">
            自己的数据：只开通了四个城市
          </p>
        </div>
        <p className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
          4 城
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <RegionPicker
          label="配送城市"
          regions={DELIVERY_REGIONS}
          placeholder="选择配送区域"
          value={code}
          onValueChange={setCode}
        />
        <RegionPicker
          label="历史地址"
          regions={DELIVERY_REGIONS}
          fallbackLabel="某某省 / 某某市（已撤销）"
          value={saved}
          onValueChange={setSaved}
        />
      </div>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 font-mono text-[11px] text-muted-foreground">
        <dt>配送城市</dt>
        <dd>value = {JSON.stringify(code)}</dd>
        <dt>代码已失效</dt>
        <dd>value = {JSON.stringify(saved)}</dd>
      </dl>
    </div>
  )
}
