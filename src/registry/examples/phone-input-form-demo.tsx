"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { PhoneInput } from "@/registry/ui/phone-input/phone-input"

/**
 * 表单提交：设了 `name`，FormData 里是 11 位纯数字；号码不完整或号段不对时，
 * 失焦后提示、提交也会被浏览器拦下。
 */
export default function PhoneInputFormDemo() {
  const [submitted, setSubmitted] = React.useState<string | null>(null)

  return (
    <form
      className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(String(new FormData(event.currentTarget).get("phone")))
      }}
    >
      <div className="flex items-baseline justify-between gap-2 pb-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">联系方式</p>
          <p className="truncate text-xs text-muted-foreground">
            试试输入 128 开头，或只填一半再点别处
          </p>
        </div>
        <p className="shrink-0 font-mono text-[11px] text-muted-foreground">
          required
        </p>
      </div>
      <PhoneInput label="手机号" name="phone" required />
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="font-mono text-[11px] text-muted-foreground">
          {submitted === null
            ? "未提交"
            : `phone = ${JSON.stringify(submitted)}`}
        </p>
        <Button type="submit">提交</Button>
      </div>
    </form>
  )
}
