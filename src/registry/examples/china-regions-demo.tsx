"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import {
  CHINA_REGIONS_UPDATED_AT,
  chinaRegions,
  type ChinaRegion,
} from "@/registry/lib/china-regions"

/** 沿树按代码找路径；数据本身就是普通对象，不需要任何额外工具 */
function findPath(nodes: ChinaRegion[], code: string): ChinaRegion[] {
  for (const node of nodes) {
    if (node.code === code) return [node]
    const rest = node.children ? findPath(node.children, code) : []
    if (rest.length) return [node, ...rest]
  }
  return []
}

/** 按层级数每一层有多少条 */
function countByLevel(nodes: ChinaRegion[], counts: number[] = [], level = 0) {
  counts[level] = (counts[level] ?? 0) + nodes.length
  for (const node of nodes)
    if (node.children) countByLevel(node.children, counts, level + 1)
  return counts
}

const COUNTS = countByLevel(chinaRegions)

/** 默认示例：输入 6 位代码反查完整路径，并看各层级条数与数据版本。 */
export default function ChinaRegionsDemo() {
  const [code, setCode] = React.useState("330106")
  const path = findPath(chinaRegions, code.trim())

  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-5 shadow-sm">
      <label htmlFor="china-regions-code" className="text-sm font-medium">
        行政区划代码
      </label>
      <Input
        id="china-regions-code"
        className="mt-1.5 font-mono tabular-nums"
        inputMode="numeric"
        autoComplete="off"
        maxLength={6}
        value={code}
        onChange={(event) => setCode(event.target.value)}
      />
      <div className="mt-4 rounded-lg border border-dashed border-edge bg-muted/30 px-3 py-2">
        <p className="font-mono text-[11px] text-muted-foreground">完整路径</p>
        <p className="mt-0.5 min-h-5 text-sm leading-5 font-medium break-words">
          {path.length ? (
            path.map((node) => node.name).join(" / ")
          ) : (
            <span className="text-muted-foreground/70">没有这个代码</span>
          )}
        </p>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-xs">
        {COUNTS.map((count, level) => (
          <React.Fragment key={level}>
            <dt className="text-muted-foreground">
              第 {level + 1} 级
            </dt>
            <dd className="text-right tabular-nums">{count}</dd>
          </React.Fragment>
        ))}
        <dt className="text-muted-foreground">合计</dt>
        <dd className="text-right tabular-nums">
          {COUNTS.reduce((sum, count) => sum + count, 0)}
        </dd>
        <dt className="text-muted-foreground">数据采集于</dt>
        <dd className="text-right">{CHINA_REGIONS_UPDATED_AT}</dd>
      </dl>
    </div>
  )
}
