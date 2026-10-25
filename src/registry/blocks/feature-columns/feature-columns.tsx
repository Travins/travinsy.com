import type { ReactNode } from "react"

import { GridColumns, GridSection } from "@/registry/ui/grid-layout/grid-layout"

type Feature = {
  title: string
  description: string
  /** 图标节点，显示在标题上方的小方块里 */
  icon?: ReactNode
}

// Tailwind 需要在源码里看到完整类名，所以不能用模板字符串拼接列数
const columnClass: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
}

/** 虚线分隔的多栏介绍，窄屏自动堆叠。建议 2–4 项，放在 GridContainer 内使用。 */
function FeatureColumns({
  title,
  items,
  id,
  className,
}: {
  /** 区块标题，例如「我在做什么」 */
  title: string
  items: readonly Feature[]
  /** 锚点 id，供页头导航跳转 */
  id?: string
  className?: string
}) {
  return (
    <GridSection data-slot="feature-columns" id={id} className={className}>
      <div className="px-4 py-4 sm:px-6">
        <h2 className="text-sm font-medium">{title}</h2>
      </div>
      <GridColumns className={columnClass[items.length] ?? "sm:grid-cols-3"}>
        {items.map((item) => (
          <div
            key={item.title}
            data-slot="feature-columns-item"
            className="flex min-w-0 flex-col items-start gap-3 p-4 sm:px-6 sm:pb-6"
          >
            {item.icon ? (
              <span
                aria-hidden="true"
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-edge bg-muted/40 text-muted-foreground [&_svg]:size-4"
              >
                {item.icon}
              </span>
            ) : null}
            <h3 className="text-sm font-medium tracking-tight">{item.title}</h3>
            <p className="text-sm leading-7 text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </GridColumns>
    </GridSection>
  )
}

export { FeatureColumns }
export type { Feature }
