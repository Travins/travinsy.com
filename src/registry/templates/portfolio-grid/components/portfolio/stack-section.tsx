import { GridSection } from "@/registry/ui/grid-layout/grid-layout"

import { resolveLabels, type PortfolioGridLabels } from "../../lib/config"

/** 技术栈：两列（≥sm 四列）的小方块网格。 */
function StackSection({
  title,
  items,
  labels,
}: {
  title: string
  items: readonly string[]
  /** 覆盖默认文案，见 lib/config.ts 的 DEFAULT_LABELS */
  labels?: Partial<PortfolioGridLabels>
}) {
  const text = resolveLabels(labels)
  return (
    <GridSection
      data-slot="portfolio-grid-stack"
      id="stack"
      aria-labelledby="stack-title"
      className="scroll-mt-16 px-4 py-6 sm:px-6"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 id="stack-title" className="text-sm font-medium">
          {title}
        </h2>
        <span
          aria-hidden="true"
          className="font-mono text-[10px] text-muted-foreground"
        >
          {text.stackEyebrow}
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {items.map((item) => (
          <li
            key={item}
            className="flex min-h-14 min-w-0 items-center gap-2 rounded-md border border-edge bg-muted/20 px-2.5 py-3 sm:px-3"
          >
            <span
              aria-hidden="true"
              className="flex size-6 shrink-0 items-center justify-center rounded border border-edge bg-background font-mono text-[10px] text-muted-foreground"
            >
              {item.slice(0, 2)}
            </span>
            <span
              className="min-w-0 font-mono text-[10px] break-words sm:text-xs"
              translate="no"
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </GridSection>
  )
}

export { StackSection }
