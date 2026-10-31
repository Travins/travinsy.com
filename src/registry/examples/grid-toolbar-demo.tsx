"use client"

import * as React from "react"
import { RefreshCw, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BarField } from "@/registry/ui/bar-field/bar-field"
import { BarSelect } from "@/registry/ui/bar-select/bar-select"
import {
  GridToolbar,
  GridToolbarItem,
} from "@/registry/ui/grid-toolbar/grid-toolbar"
import { SegmentedControl } from "@/registry/ui/segmented-control/segmented-control"

const LEVELS = [
  { value: "all", label: "全部" },
  { value: "info", label: "信息" },
  { value: "warn", label: "警告" },
  { value: "error", label: "错误" },
]

const SERVICES = [
  { value: "gateway", label: "网关" },
  { value: "worker", label: "任务队列" },
  { value: "search", label: "检索" },
]

/** 日志页的筛选条：搜索占满剩余宽度，级别、服务、刷新各占一格 */
export default function GridToolbarDemo() {
  return (
    <div className="w-full max-w-3xl">
      <GridToolbar aria-label="日志筛选">
        <GridToolbarItem grow className="basis-full @min-[36rem]:basis-auto">
          <BarField
            aria-label="搜索日志"
            icon={<Search />}
            type="search"
            placeholder="搜索日志…"
          />
        </GridToolbarItem>
        <GridToolbarItem className="basis-full @min-[36rem]:basis-auto">
          <SegmentedControl
            aria-label="级别"
            defaultValue="all"
            className="[&_[data-slot=segmented-control-item]]:flex-1"
            options={LEVELS}
          />
        </GridToolbarItem>
        <GridToolbarItem className="flex-1 @min-[36rem]:w-44 @min-[36rem]:flex-none">
          <BarSelect
            multiple
            label="服务"
            placeholder="全部"
            options={SERVICES}
          />
        </GridToolbarItem>
        <GridToolbarItem>
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label="刷新"
            className="h-full rounded-none focus-visible:ring-inset"
          >
            <RefreshCw />
          </Button>
        </GridToolbarItem>
      </GridToolbar>
    </div>
  )
}
