import type { ReactNode } from "react"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { GridContainer } from "@/registry/ui/grid-layout/grid-layout"

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="[--grid-width:80rem]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-background focus:p-3"
      >
        跳至正文
      </a>
      <SiteHeader />
      <GridContainer>{children}</GridContainer>
      <SiteFooter />
    </div>
  )
}
