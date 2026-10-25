import { GridSection } from "@/registry/ui/grid-layout/grid-layout"

import { resolveLabels, type PortfolioGridLabels } from "../../lib/config"

/** 关于我：几段正文 + 一行等宽小字收尾。 */
function AboutSection({
  title,
  paragraphs,
  labels,
}: {
  title: string
  paragraphs: readonly string[]
  /** 覆盖默认文案，见 lib/config.ts 的 DEFAULT_LABELS */
  labels?: Partial<PortfolioGridLabels>
}) {
  const text = resolveLabels(labels)
  return (
    <GridSection
      data-slot="portfolio-grid-about"
      id="about"
      aria-labelledby="about-title"
      className="scroll-mt-16 px-4 py-8 sm:px-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 id="about-title" className="text-sm font-medium">
          {title}
        </h2>
        <span aria-hidden="true" className="text-muted-foreground">
          ↘
        </span>
      </div>
      <div className="flex max-w-xl flex-col gap-3 text-sm leading-7 text-pretty text-muted-foreground">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <p className="mt-6 font-mono text-xs text-muted-foreground">
        {text.aboutFootnote}
        <span className="ml-2 text-primary">_</span>
      </p>
    </GridSection>
  )
}

export { AboutSection }
