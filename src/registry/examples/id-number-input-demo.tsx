"use client"

import * as React from "react"
import { ShieldCheck } from "lucide-react"

import {
  IdNumberInput,
  maskIdNumber,
} from "@/registry/ui/id-number-input/id-number-input"

export default function IdNumberInputDemo() {
  const [value, setValue] = React.useState("11010519491231002X")

  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">实名认证</p>
          <p className="text-xs text-muted-foreground">核对证件信息后继续</p>
        </div>
        <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {maskIdNumber("idcard", value) || "尚未填写"}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {/* 和证件号输入同一条窄屏规则：容器窄于 20rem 时标签挪到条上方，同一张卡片里的字段才一致 */}
        <div className="@container/field flex flex-col gap-1.5">
          <span
            aria-hidden="true"
            className="hidden text-xs text-muted-foreground @max-[20rem]/field:block"
          >
            姓名
          </span>
          <label className="flex h-9 min-w-0 items-center gap-3 rounded-md border border-edge bg-muted/60 px-3 text-sm focus-within:border-foreground/25 focus-within:bg-background @max-[20rem]/field:px-2.5 dark:focus-within:bg-input/30 pointer-coarse:h-11">
            <span className="shrink-0 text-muted-foreground @max-[20rem]/field:sr-only">
              姓名
            </span>
            <input
              type="text"
              name="realName"
              autoComplete="name"
              defaultValue="张女士"
              className="min-w-0 flex-1 bg-transparent text-right text-base outline-none md:text-sm @max-[20rem]/field:text-left"
            />
          </label>
        </div>
        <IdNumberInput
          label="身份证号"
          size="lg"
          value={value}
          onValueChange={setValue}
        />
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <ShieldCheck className="size-3 shrink-0" aria-hidden="true" />
        示例号码仅用于演示格式与校验
      </p>
    </div>
  )
}
