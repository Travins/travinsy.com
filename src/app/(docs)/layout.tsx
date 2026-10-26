import type { ReactNode } from "react"
import { SiteShell } from "@/components/site/site-shell"
import { GridContainer } from "@/registry/ui/grid-layout/grid-layout"

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell>
      <GridContainer>{children}</GridContainer>
    </SiteShell>
  )
}
