"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import {
  toChineseNumerals,
  toRmbUppercase,
} from "@/registry/lib/chinese-number"

const ROWS = [
  { label: "人民币大写", format: (value: string) => toRmbUppercase(value) },
  { label: "中文读法", format: (value: string) => toChineseNumerals(value) },
  {
    label: "大写读法",
    format: (value: string) => toChineseNumerals(value, { financial: true }),
  },
]

/** 默认示例：输入一个数字，同时看人民币大写、中文读法和大写读法。 */
export default function ChineseNumberDemo() {
  const [value, setValue] = React.useState("10010.05")

  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-5 shadow-sm">
      <label htmlFor="chinese-number-input" className="text-sm font-medium">
        数字
      </label>
      <Input
        id="chinese-number-input"
        className="mt-1.5 font-mono tabular-nums"
        inputMode="decimal"
        autoComplete="off"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <dl className="mt-4 flex flex-col gap-2.5">
        {ROWS.map((row) => {
          const text = row.format(value)
          return (
            <div
              key={row.label}
              className="rounded-lg border border-dashed border-edge bg-muted/30 px-3 py-2"
            >
              <dt className="font-mono text-[11px] text-muted-foreground">
                {row.label}
              </dt>
              <dd className="mt-0.5 min-h-5 text-sm leading-5 font-medium break-words">
                {text || <span className="text-muted-foreground/70">—</span>}
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
