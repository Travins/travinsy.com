"use client"
import { DataTable } from "@/registry/blocks/data-table-01/data-table"
import {
  columns,
  getRowId,
  type Dataset,
} from "@/registry/blocks/data-table-01/page"
const data: Dataset[] = Array.from({ length: 10000 }, (_, i) => ({
  id: String(i),
  name: "观测数据 " + (i + 1),
  owner: ["林小满", "周远"][i % 2],
  status: "进行中",
  samples: ((i * 1664525 + 1013904223) >>> 0) % 100000,
  updated: "2026-10-20",
}))
export default function LargeDemo() {
  return (
    <DataTable
      className="max-w-[800px]"
      columns={columns}
      data={data}
      getRowId={getRowId}
      virtualization={{ height: 480 }}
    />
  )
}
