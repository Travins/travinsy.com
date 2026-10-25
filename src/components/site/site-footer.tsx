import { FOOTER_LINKS, SITE_NAME } from "@/components/site/site-config"
import { GridContainer } from "@/registry/ui/grid-layout/grid-layout"

export function SiteFooter() {
  return (
    // -mt-px：与上一行的 screen-line-bottom 重叠成一条线，避免出现 2px 双线
    <footer className="screen-line-top -mt-px">
      <GridContainer className="flex flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="leading-7">
          © {new Date().getFullYear()} {SITE_NAME}. 保留所有权利。
        </p>
        <nav aria-label="页脚链接" className="flex items-center gap-4 font-mono text-xs">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.href.startsWith("http")
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </GridContainer>
    </footer>
  )
}
