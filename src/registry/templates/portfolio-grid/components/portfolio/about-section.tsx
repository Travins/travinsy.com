import { GridSection } from "@/registry/ui/grid-layout/grid-layout"

/** 关于我：几段正文 + 一行等宽小字收尾。 */
export function AboutSection({
  title,
  paragraphs,
}: {
  title: string
  paragraphs: readonly string[]
}) {
  return (
    <GridSection
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
        持续学习，慢慢构建。<span className="ml-2 text-primary">_</span>
      </p>
    </GridSection>
  )
}
