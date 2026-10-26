import { GridSection } from "@/registry/ui/grid-layout/grid-layout"

type SectionHeadingProps = {
  label: string
  count: number
  title: string
  description: string
}

export function SectionHeading({
  label,
  count,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <GridSection className="px-4 py-10 sm:px-6 sm:py-14">
      <p className="mb-4 font-mono text-xs text-muted-foreground">
        {label} / {count}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
        {description}
      </p>
    </GridSection>
  )
}
