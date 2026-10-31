"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { numberFormat } from "@/registry/blocks/data-table-01/config"
import { DataTable } from "@/registry/blocks/data-table-01/data-table"
import type { DataTableColumn } from "@/registry/blocks/data-table-01/types"
type Dataset = {
  id: string
  name: string
  owner: string
  status: string
  samples: number
  updated: string
}
const datasets: Dataset[] = Array.from({ length: 64 }, (_, i) => ({
  id: String(i + 1),
  name:
    ["城市声景", "植物图谱", "手写字迹", "街道影像"][i % 4] +
    " " +
    String(i + 1).padStart(2, "0"),
  owner: ["林小满", "陈青", "周远"][i % 3],
  status: ["进行中", "已归档", "待审核"][i % 3],
  samples: 1200 + i * 137,
  updated: "2026-10-" + String(10 + (i % 20)).padStart(2, "0"),
}))
const columns: DataTableColumn<Dataset>[] = [
  {
    accessorKey: "name",
    header: "名称",
    size: 240,
    meta: {
      pinned: true,
      editable: "text",
      validate: (value) => (String(value).trim() ? undefined : "请输入名称"),
    },
  },
  { accessorKey: "owner", header: "负责人", size: 140 },
  { accessorKey: "status", header: "状态", size: 140 },
  {
    accessorKey: "samples",
    header: "样本数",
    cell: ({ getValue }) => numberFormat.format(Number(getValue())),
    size: 140,
    meta: {
      align: "right",
      editable: "number",
      validate: (value) =>
        Number.isFinite(value) && Number(value) >= 0
          ? undefined
          : "样本数不能小于零",
    },
  },
  {
    accessorKey: "updated",
    header: "更新时间",
    size: 180,
    meta: { hideOnMobile: true },
  },
]
const getRowId = (row: Dataset) => row.id
function DataTablePage() {
  const [data, setData] = React.useState(datasets)
  const [selection, setSelection] = React.useState<Record<string, boolean>>({})
  const [notice, setNotice] = React.useState("")
  function exportRows(rows: Dataset[]) {
    const url = URL.createObjectURL(
      new Blob(
        [
          "\ufeff名称,负责人,状态,样本数,更新时间\n" +
            rows
              .map((row) =>
                [
                  row.name,
                  row.owner,
                  row.status,
                  row.samples,
                  row.updated,
                ].join(","),
              )
              .join("\n"),
        ],
        { type: "text/csv;charset=utf-8" },
      ),
    )
    const link = document.createElement("a")
    link.href = url
    link.download = "数据集.csv"
    link.click()
    URL.revokeObjectURL(url)
    setNotice("已导出 " + rows.length + " 条")
  }
  return (
    <main
      data-slot="data-table-page"
      className="mx-auto w-full max-w-6xl min-w-0 p-4 md:p-6"
    >
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">数据集</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          整理、审核与维护团队的数据资源。
        </p>
      </div>
      <DataTable
        columns={columns}
        data={data}
        rowCount={data.length}
        rowSelection={selection}
        onRowSelectionChange={setSelection}
        onSelectAll={() =>
          setSelection(Object.fromEntries(data.map((row) => [row.id, true])))
        }
        bulkActions={(rows) => (
          <>
            <Button
              size="default"
              variant="outline"
              onClick={() => exportRows(rows)}
            >
              导出
            </Button>
            <Button
              size="default"
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                setData((previous) =>
                  previous.filter((row) => !selection[row.id]),
                )
                setSelection({})
                setNotice("已删除选中的数据集")
              }}
            >
              删除
            </Button>
          </>
        )}
        onCellCommit={({ rowId, columnId, value }) =>
          setData((previous) =>
            previous.map((row) =>
              row.id === rowId ? { ...row, [columnId]: value } : row,
            ),
          )
        }

        getRowId={getRowId}
        statusFilter={{
          columnId: "status",
          options: [
            { value: "", label: "全部" },
            { value: "进行中", label: "进行中" },
            { value: "已归档", label: "已归档" },
            { value: "待审核", label: "待审核" },
          ],
        }}
      />
      <p role="status" className="sr-only">
        {notice}
      </p>
    </main>
  )
}
export default DataTablePage
export { datasets, columns, getRowId }
export type { Dataset }
