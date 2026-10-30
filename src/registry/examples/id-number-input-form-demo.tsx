"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { IdNumberInput } from "@/registry/ui/id-number-input/id-number-input"

export default function IdNumberInputFormDemo() {
  const [submitted, setSubmitted] = React.useState<string | null>(null)

  return (
    <form
      className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(
          JSON.stringify(
            Object.fromEntries(new FormData(event.currentTarget)),
            null,
            2,
          ),
        )
      }}
      onReset={() => setSubmitted(null)}
    >
      <div className="pb-3">
        <p className="text-sm font-medium">企业开票信息</p>
        <p className="text-xs text-muted-foreground">
          提交原始号码，重置后恢复示例值
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {/* 和证件号输入同一条窄屏规则：容器窄于 20rem 时标签挪到条上方，同一张卡片里的字段才一致 */}
        <div className="@container/field flex flex-col gap-1.5">
          <span
            aria-hidden="true"
            className="hidden text-xs text-muted-foreground @max-[20rem]/field:block"
          >
            发票抬头
          </span>
          <label className="flex h-8 min-w-0 items-center gap-3 rounded-md border border-edge bg-muted/60 px-3 text-sm focus-within:ring-3 focus-within:ring-ring/50 @max-[20rem]/field:px-2.5 pointer-coarse:h-10">
            <span className="shrink-0 text-muted-foreground @max-[20rem]/field:sr-only">
              发票抬头
            </span>
            <input
              type="text"
              name="title"
              autoComplete="organization"
              defaultValue="示例科技有限公司"
              required
              className="min-w-0 flex-1 bg-transparent text-right text-base outline-none md:text-sm @max-[20rem]/field:text-left"
            />
          </label>
        </div>
        <IdNumberInput
          kind="uscc"
          label="信用代码"
          name="uscc"
          defaultValue="91350100M000100Y43"
          required
        />
        <IdNumberInput
          kind="bankcard"
          label="银行卡号"
          name="bankcard"
          defaultValue="6222021234567890123"
          bankcardCheck="length"
          required
          showLength
        />
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <Button type="reset" variant="outline">
          重置
        </Button>
        <Button type="submit">提交</Button>
      </div>
      <pre
        className="mt-3 overflow-x-auto rounded-md bg-muted/50 p-3 font-mono text-[11px]"
        aria-live="polite"
      >
        {submitted ?? "尚未提交"}
      </pre>
    </form>
  )
}
