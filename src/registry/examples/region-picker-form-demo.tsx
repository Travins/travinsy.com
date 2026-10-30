"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RegionPicker } from "@/registry/ui/region-picker/region-picker"

const loadRegions = () =>
  import("@/registry/lib/china-regions").then((m) => m.chinaRegions)

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
      className="flex w-full max-w-xs flex-col gap-4 rounded-xl border border-edge bg-background p-5 shadow-sm"
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
      <p className="text-sm font-medium">收货地址</p>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="region-form-consignee" className="text-sm font-medium">
          收货人
        </label>
        <Input
          id="region-form-consignee"
          name="consignee"
          defaultValue="林小满"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="region-form-region" className="text-sm font-medium">
          所在地区
        </label>
        <RegionPicker
          id="region-form-region"
          name="region"
          required
          regions={loadRegions}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="region-form-address" className="text-sm font-medium">
          详细地址
        </label>
        <Input
          id="region-form-address"
          name="address"
          placeholder="街道、门牌号"
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">不选地区无法提交</p>
        <Button type="submit">保存</Button>
      </div>
      {submitted && (
        <dl className="rounded-lg border border-dashed border-edge bg-muted/30 p-3 font-mono text-xs">
          <dt className="text-muted-foreground">FormData</dt>
          <dd>consignee = {JSON.stringify(submitted.consignee)}</dd>
          <dd>region = {JSON.stringify(submitted.region)}</dd>
          <dd>address = {JSON.stringify(submitted.address)}</dd>
        </dl>
      )}
    </form>
  )
}
