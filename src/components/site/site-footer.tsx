import { FOOTER_LINKS, ICP, SITE_NAME } from "@/components/site/site-config"
import { GridContainer } from "@/registry/ui/grid-layout/grid-layout"

export function SiteFooter() {
  return (
    // -mt-px：与上一行的 screen-line-bottom 重叠成一条线，避免出现 2px 双线
    <footer className="screen-line-top -mt-px">
      <GridContainer className="flex flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-x-4 gap-y-1 text-xs leading-5 sm:flex-row sm:flex-wrap sm:items-center">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. 保留所有权利。
          </p>
          <a
            href={ICP.href}
            target="_blank"
            rel="noreferrer"
            className="w-fit transition-colors hover:text-foreground"
          >
            {ICP.label}
          </a>
        </div>
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
