"use client"

import { IdNumberInput } from "@/registry/ui/id-number-input/id-number-input"

export default function IdNumberInputKindsDemo() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="pb-3">
        <p className="text-sm font-medium">三种号码</p>
        <p className="text-xs text-muted-foreground">
          聚焦查看明文，失焦恢复打码
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <IdNumberInput
          label="身份证号"
          defaultValue="11010519491231002X"
          mask
        />
        <IdNumberInput
          kind="bankcard"
          label="银行卡号"
          defaultValue="6222021234567890123"
          mask
          showLength
        />
        <IdNumberInput
          kind="uscc"
          label="信用代码"
          defaultValue="91350100M000100Y44"
          error="校验位不正确，请核对证件上的末位字符"
        />
      </div>
    </div>
  )
}
