"use client"

import { BarField } from "@/registry/ui/bar-field/bar-field"
import { Search } from "lucide-react"

export default function Demo() {
  return (
    <div className="w-full max-w-3xl space-y-4 rounded-xl border border-edge bg-background p-4 shadow-xs">
      <BarField
        type="search"
        clearable
        defaultValue="网格布局"
        label="搜索"
        icon={<Search />}
        placeholder="搜索组件"
        suffix={
          <kbd className="grid h-5 min-w-5 place-items-center rounded-sm border border-edge bg-background px-1 font-mono text-[11px] text-muted-foreground">
            /
          </kbd>
        }
      />
    </div>
  )
}
