"use client"
import { BarSelect } from "@/registry/ui/bar-select/bar-select"
import { BarField } from "@/registry/ui/bar-field/bar-field"
import {
  GridToolbar,
  GridToolbarItem,
} from "@/registry/ui/grid-toolbar/grid-toolbar"
import { SegmentedControl } from "@/registry/ui/segmented-control/segmented-control"
export default function GridToolbarWrapDemo() {
  return (
    <div data-slot="grid-toolbar-wrap-demo" className="w-full max-w-xs">
      <GridToolbar aria-label="窄容器筛选">
        <GridToolbarItem grow className="basis-full">
          <BarField type="search" label="搜索" placeholder="搜索项目…" />
        </GridToolbarItem>
        <GridToolbarItem className="basis-44" grow>
          <SegmentedControl
            aria-label="项目状态"
            defaultValue="all"
            options={[
              { value: "all", label: "全部" },
              { value: "active", label: "进行中" },
            ]}
          />
        </GridToolbarItem>
        <GridToolbarItem grow className="basis-40">
          <BarSelect
            label="排序"
            defaultValue="time"
            options={[
              { value: "time", label: "最近更新" },
              { value: "name", label: "名称" },
            ]}
          />
        </GridToolbarItem>
      </GridToolbar>
    </div>
  )
}
