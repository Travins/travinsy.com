import { GridSection } from "@/registry/ui/grid-layout/grid-layout"

/** 技术栈：两列（≥sm 四列）的小方块网格。 */
export function StackSection({
  title,
  items,
}: {
  title: string
  items: readonly string[]
}) {
  return (
    <GridSection
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
          TOOLS OF THE TRADE
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
