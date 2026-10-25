import { siteConfig } from "@/registry/templates/portfolio-grid/lib/site.config"
import { GridContainer } from "@/registry/ui/grid-layout/grid-layout"

import { resolveLabels, type PortfolioGridLabels } from "../../lib/config"

/** 简易页头：站名 + 锚点导航。screen-line-bottom 放在内层，避免与 sticky 冲突。 */
function SiteHeader({
  labels,
}: {
  /** 覆盖默认文案，见 lib/config.ts 的 DEFAULT_LABELS */
  labels?: Partial<PortfolioGridLabels>
}) {
  const text = resolveLabels(labels)
  return (
    <header
      data-slot="portfolio-grid-site-header"
      className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
    >
      <div className="screen-line-bottom">
        <GridContainer className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6">
          <a
            href="#top"
            className="rounded-md font-mono text-sm font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            translate="no"
          >
            {siteConfig.name}
          </a>
          <nav
            data-slot="portfolio-grid-site-nav"
            aria-label={text.siteNav}
            className="flex items-center gap-1"
          >
            {siteConfig.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </GridContainer>
      </div>
    </header>
  )
}

export { SiteHeader }
