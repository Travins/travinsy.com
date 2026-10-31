"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/registry/blocks/data-table-01/data-table"
import {
  datasets,
  columns,
  getRowId,
} from "@/registry/blocks/data-table-01/page"
export default function StatesDemo() {
  const [state, setState] = React.useState("default")
  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap gap-2">
        {["default", "loading", "empty", "filtered", "error"].map(
          (value, index) => (
            <Button
              key={value}
              variant="outline"
              onClick={() => setState(value)}
            >
              {["默认", "加载", "暂无数据", "无匹配", "错误"][index]}
            </Button>
          ),
        )}
      </div>
      <DataTable
        columns={columns}
        data={state === "empty" ? [] : datasets}
        getRowId={getRowId}
        loading={state === "loading"}
        error={state === "error" ? "读取失败，请重试" : null}
        onRetry={() => setState("default")}
        globalFilter={state === "filtered" ? "不存在的数据集" : undefined}
        onGlobalFilterChange={() => setState("default")}
        onCellCommit={async ({ value }) => {
          await new Promise((resolve) => setTimeout(resolve, 350))
          if (value === "失败") throw new Error("保存失败，请修改后重试")
        }}
      />
    </div>
  )
}
