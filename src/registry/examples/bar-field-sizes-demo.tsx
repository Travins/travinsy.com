"use client"

import * as React from "react"
import { BarField } from "@/registry/ui/bar-field/bar-field"

export default function Demo() {
  const [value, setValue] = React.useState("hello")
  return (
    <div className="w-full max-w-3xl space-y-4 rounded-xl border border-edge bg-background p-4 shadow-xs">
      <BarField label="小尺寸" size="sm" placeholder="28px" />
      <BarField label="默认尺寸" placeholder="32px" />
      <BarField label="大尺寸" size="lg" placeholder="36px" />
      <BarField
        label="邮箱"
        value={value}
        onValueChange={setValue}
        error={value.includes("@") ? undefined : "请输入有效邮箱"}
      />
      <BarField label="账号" disabled defaultValue="只读示例" />
      <BarField label="备注" description="仅自己可见" />
    </div>
  )
}
