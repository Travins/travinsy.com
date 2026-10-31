"use client"
import * as React from "react"
import { Plus, Upload, MoreHorizontal, Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { numberFormat } from "@/registry/blocks/data-table-01/config"
import { DataTable } from "@/registry/blocks/data-table-01/data-table"
import type { DataTableColumn } from "@/registry/blocks/data-table-01/types"
type Dataset = {
  code: string
  id: string
  name: string
  owner: string
  status: string
  samples: number
  updatedAt: string
}
const datasets: Dataset[] = Array.from({ length: 64 }, (_, i) => ({
  code: "DS-" + String(i + 1).padStart(4, "0"),
  id: String(i + 1),
  name:
    ["城市声景", "植物图谱", "手写字迹", "街道影像"][i % 4] +
    " " +
    String(i + 1).padStart(2, "0"),
  owner: ["林小满", "陈青", "周远"][i % 3],
  status: ["进行中", "已归档", "待审核"][i % 3],
  samples: 1200 + i * 137,
  updatedAt: new Date(
    Date.UTC(2026, 9, 31, 0) - (i < 6 ? (i + 1) * 3600000 : (i - 4) * 86400000),
  ).toISOString(),
}))
const columns: DataTableColumn<Dataset>[] = [
  {
    accessorKey: "name",
    header: "名称",
    size: 240,
    cell: ({ row, getValue }) => (
      <span>
        <span className="font-medium">{String(getValue())}</span>
        <span className="mt-1 block font-mono text-[10px] text-muted-foreground">
          {row.original.code}
        </span>
      </span>
    ),
    meta: {
      pinned: true,
      editable: "text",
      validate: (value) => (String(value).trim() ? undefined : "请输入名称"),
    },
  },
  {
    accessorKey: "owner",
    header: "负责人",
    size: 140,
    cell: ({ getValue }) => (
      <span className="inline-flex items-center gap-2">
        <span className="flex size-5 items-center justify-center rounded-sm border border-edge bg-muted text-[10px]">
          {String(getValue()).slice(0, 1)}
        </span>
        {String(getValue())}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "状态",
    size: 140,
    cell: ({ getValue }) => (
      <span className="inline-flex items-center gap-2">
        <span
          className={
            String(getValue()) === "进行中"
              ? "size-1.5 rounded-full bg-(--flow-green)"
              : String(getValue()) === "待审核"
                ? "size-1.5 rounded-full bg-(--flow-amber)"
                : "size-1.5 rounded-full bg-muted-foreground"
          }
        />
        {String(getValue())}
      </span>
    ),
  },
  {
    accessorKey: "samples",
    header: "样本数",
    cell: ({ getValue }) => numberFormat.format(Number(getValue())),
    size: 140,
    meta: {
      bar: true,
      align: "right",
      editable: "number",
      validate: (value) =>
        Number.isFinite(value) && Number(value) >= 0
          ? undefined
          : "样本数不能小于零",
    },
  },
  {
    accessorKey: "updatedAt",
    cell: ({ getValue }) => <RelativeDate value={String(getValue())} />,
    header: "更新时间",
    size: 180,
    meta: {
      hideOnMobile: true,
      detailCell: (value) => <RelativeDate value={String(value)} exact />,
    },
  },
]
function RelativeDate({
  value,
  exact = false,
}: {
  value: string
  exact?: boolean
}) {
  const [now, setNow] = React.useState<number | null>(null)
  React.useEffect(() => {
    const update = () => setNow(Date.now())
    const timer = setTimeout(update, 0)
    const interval = setInterval(update, 60000)
    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])
  const date = new Date(value)
  const days = now === null ? 100 : (now - date.getTime()) / 86400000
  const relative = new Intl.RelativeTimeFormat("zh-CN", { numeric: "auto" })
  const text =
    days > 7
      ? value.slice(5, 10)
      : days < 1
        ? relative.format(-Math.max(1, Math.floor(days * 24)), "hour")
        : relative.format(-Math.floor(days), "day")
  return (
    <time
      data-slot="data-table-date"
      dateTime={value}
      title={new Intl.DateTimeFormat("zh-CN", {
        dateStyle: "full",
        timeStyle: "long",
        timeZone: "Asia/Shanghai",
      }).format(date)}
      className="font-mono text-xs text-muted-foreground"
    >
      {exact
        ? new Intl.DateTimeFormat("sv-SE", {
            timeZone: "Asia/Shanghai",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }).format(date) +
          "（" +
          text +
          "）"
        : text}
    </time>
  )
}
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
                  row.updatedAt,
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
      className="@container mx-auto w-full max-w-6xl min-w-0 p-4 md:p-6"
    >
      <header className="mb-6 flex flex-col items-start justify-between gap-4 @min-[40rem]:flex-row @min-[40rem]:items-end">
        <div>
          <p className="mb-3 font-mono text-[11px] tracking-[0.06em]">
            DATASETS /{" "}
            <span className="text-muted-foreground">
              数据集 · {data.length}
            </span>
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">数据集</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setNotice("请选择 CSV 文件导入")}
          >
            <Upload />
            导入
          </Button>
          <Button
            onClick={() => {
              const id = String(
                Math.max(0, ...data.map((row) => Number(row.id))) + 1,
              )
              setData((previous) => [
                {
                  ...datasets[0],
                  id,
                  code: "DS-" + id.padStart(4, "0"),
                  name: "新建数据集",
                },
                ...previous,
              ])
              setNotice("已新建数据集")
            }}
          >
            <Plus />
            新建数据集
          </Button>
        </div>
      </header>
      <DataTable
        rowActions={(row) => (
          <Button
            variant="ghost"
            size="icon"
            aria-label={row.name + "的操作"}
            onClick={() => exportRows([row])}
          >
            <MoreHorizontal />
          </Button>
        )}
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
              variant="ghost"
              size="default"
              aria-label="导出"
              onClick={() => exportRows(rows)}
            >
              <Download />
              <span data-label>导出</span>
            </Button>
            {/* 反色坞里删除用红色文字区分，混入背景色保证亮暗模式都清楚 */}
            <Button
              variant="ghost"
              size="default"
              aria-label="删除"
              className="text-[color-mix(in_oklab,var(--destructive)_75%,var(--background))]!"
              onClick={() => {
                setData((previous) =>
                  previous.filter((row) => !selection[row.id]),
                )
                setSelection({})
                setNotice("已删除选中的数据集")
              }}
            >
              <Trash2 />
              <span data-label>删除</span>
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
            { value: "进行中", label: "进行中", tone: "var(--flow-green)" },
            { value: "待审核", label: "待审核", tone: "var(--flow-amber)" },
            {
              value: "已归档",
              label: "已归档",
              tone: "var(--muted-foreground)",
            },
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
