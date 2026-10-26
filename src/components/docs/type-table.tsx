"use client"

import { ChevronDown } from "lucide-react"
import type { ReactNode } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { typeTableGrid } from "./type-table-shared"

/**
 * 一行属性：名称 + 简化类型 + chevron，点开后显示服务端渲染好的详情（children）。
 * 交互只有展开 / 收起，所以详情内容全部由服务端组件传入，客户端只留这一层壳。
 */
function TypeTableRow({
  name,
  simplifiedType,
  required,
  deprecated,
  children,
}: {
  name: string
  simplifiedType: string
  required?: boolean
  deprecated?: boolean
  children: ReactNode
}) {
  return (
    <Collapsible
      data-slot="type-table-row"
      className="group/row rounded-lg border border-transparent transition-colors data-[open]:border-edge data-[open]:bg-background"
    >
      <CollapsibleTrigger
        data-slot="type-table-trigger"
        className={cn(
          typeTableGrid,
          "group/trigger w-full cursor-pointer items-center rounded-[inherit] px-3 py-2 text-left font-mono text-[12.5px] leading-5 transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 group-data-[open]/row:rounded-b-none",
        )}
      >
        <span
          className={cn(
            // 主题强调色混入前景色：保证 14 套主题在亮 / 暗下都有足够对比度
            "min-w-0 font-medium break-all text-[color-mix(in_oklab,var(--primary),var(--foreground)_55%)]",
            deprecated && "line-through decoration-1",
          )}
        >
          {name}
          {required ? null : "?"}
        </span>
        <span className="min-w-0 truncate text-foreground">
          {simplifiedType}
        </span>
        <ChevronDown
          aria-hidden="true"
          className="size-4 text-muted-foreground transition-transform duration-200 group-data-[panel-open]/trigger:rotate-180 motion-reduce:transition-none"
        />
      </CollapsibleTrigger>
      <CollapsibleContent
        data-slot="type-table-content"
        hiddenUntilFound
        className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none"
      >
        <div className="border-t border-edge px-3 py-3">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export { TypeTableRow }
