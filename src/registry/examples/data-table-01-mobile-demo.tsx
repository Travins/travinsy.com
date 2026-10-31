"use client"
import DataTablePage from "@/registry/blocks/data-table-01/page"
export default function MobileDemo() {
  return (
    <div className="max-w-full rounded-[3rem] border border-edge bg-muted p-2 max-sm:contents">
      <div className="h-[874px] w-[402px] max-w-full overflow-auto rounded-[2.5rem] bg-background pt-10 max-sm:w-full max-sm:rounded-none">
        <DataTablePage />
      </div>
    </div>
  )
}
