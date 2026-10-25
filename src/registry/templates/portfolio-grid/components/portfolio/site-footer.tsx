import { siteConfig } from "@/registry/templates/portfolio-grid/lib/site.config"
import { GridContainer } from "@/registry/ui/grid-layout/grid-layout"

/** 简易页脚：版权 + 一行说明。上方横线由页面最后一个 GridSection 提供。 */
export function SiteFooter() {
  return (
    <footer>
      <GridContainer className="flex flex-wrap items-center justify-between gap-2 px-4 py-6 font-mono text-xs text-muted-foreground sm:px-6">
        <span translate="no">
          © {siteConfig.year} {siteConfig.name}
        </span>
        <span>{siteConfig.footer}</span>
      </GridContainer>
    </footer>
  )
}
