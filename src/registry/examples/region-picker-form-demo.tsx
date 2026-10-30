"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { RegionPicker } from "@/registry/ui/region-picker/region-picker"

const loadRegions = () =>
  import("@/registry/lib/china-regions").then((m) => m.chinaRegions)

/** 文本框也做成方条：标签在条内左侧、内容靠右，和选择器排在一起是一套样式 */
const FIELD =
  "flex h-8 items-center gap-3 rounded-md border border-edge bg-muted/60 px-3 text-sm pointer-coarse:h-10 focus-within:ring-3 focus-within:ring-ring/50"
const FIELD_INPUT =
  "min-w-0 flex-1 bg-transparent text-right text-base outline-none placeholder:text-muted-foreground md:text-sm"

/**
 * 表单提交：设了 `name`，FormData 里是最末一级的代码（"330106"），未选时是空串；
 * `required` 未选会拦住提交，浏览器会在选择器上给出提示。
 */
export default function RegionPickerFormDemo() {
  const [submitted, setSubmitted] = React.useState<{
    consignee: string
    region: string
    address: string
  } | null>(null)

  return (
    <form
      className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setSubmitted({
          consignee: String(data.get("consignee")),
          region: String(data.get("region")),
          address: String(data.get("address")),
        })
      }}
    >
      <div className="flex items-baseline justify-between gap-2 pb-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">收货地址</p>
          <p className="truncate text-xs text-muted-foreground">
            不选地区无法提交
          </p>
        </div>
        <p className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
          required
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <label className={FIELD}>
          <span className="shrink-0 text-muted-foreground">收货人</span>
          <input
            name="consignee"
            defaultValue="林小满"
            className={FIELD_INPUT}
          />
        </label>
        <RegionPicker
          label="所在地区"
          name="region"
          required
          regions={loadRegions}
        />
        <label className={FIELD}>
          <span className="shrink-0 text-muted-foreground">详细地址</span>
          <input
            name="address"
            placeholder="街道、门牌号"
            className={FIELD_INPUT}
          />
        </label>
      </div>
      <div className="mt-3 flex justify-end">
        <Button type="submit">保存</Button>
      </div>
      {submitted && (
        <dl className="mt-3 rounded-lg border border-dashed border-edge bg-muted/30 p-3 font-mono text-xs">
          <dt className="text-muted-foreground">FormData</dt>
          <dd>consignee = {JSON.stringify(submitted.consignee)}</dd>
          <dd>region = {JSON.stringify(submitted.region)}</dd>
          <dd>address = {JSON.stringify(submitted.address)}</dd>
        </dl>
      )}
    </form>
  )
}
