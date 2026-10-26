import { Globe, Mail } from "lucide-react"
import type { ReactNode, SVGProps } from "react"

import { GridSection } from "@/registry/ui/grid-layout/grid-layout"

import { resolveLabels, type PortfolioGridLabels } from "../../lib/config"
import type { SocialIcon } from "../../lib/site.config"

/** 品牌标识用独立 SVG，不依赖图标库里的品牌图标。 */
function GitHubMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      data-slot="portfolio-grid-github-mark"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.81c.85 0 1.71.11 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  )
}

/** X（原 Twitter）标识。 */
function XMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      data-slot="portfolio-grid-x-mark"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l7.9-9L1.8 2h6.5l4.5 6.8L18.9 2Zm-1.1 18h1.7L7.3 3.9H5.5L17.8 20Z" />
    </svg>
  )
}

const socialIcons: Record<SocialIcon, ReactNode> = {
  github: <GitHubMark />,
  x: <XMark />,
  mail: <Mail strokeWidth={1.5} />,
  link: <Globe strokeWidth={1.5} />,
}

type SocialLink = {
  /** 链接名称，同时作为读屏名称与悬停提示 */
  name: string
  href: string
  icon: SocialIcon
}

/** 社交链接：一行图标方块。放在 GridContainer 内使用。 */
function SocialLinks({
  socials,
  labels,
}: {
  socials: readonly SocialLink[]
  /** 覆盖默认文案，见 lib/config.ts 的 DEFAULT_LABELS */
  labels?: Partial<PortfolioGridLabels>
}) {
  const text = resolveLabels(labels)
  return (
    <GridSection
      data-slot="portfolio-grid-social-links"
      aria-label={text.socialLinks}
      className="px-4 py-4 sm:px-6"
    >
      <ul className="flex gap-2">
        {socials.map((social) => {
          // mailto 链接留在当前页，其余在新窗口打开
          const external = !social.href.startsWith("mailto:")
          return (
            <li key={social.name}>
              <a
                href={social.href}
                aria-label={
                  external ? `${social.name}（在新窗口打开）` : social.name
                }
                title={social.name}
                {...(external
                  ? { target: "_blank", rel: "noreferrer noopener" }
                  : {})}
                className="inline-flex size-9 items-center justify-center rounded-md border border-edge bg-muted/30 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:size-4.5"
              >
                <span aria-hidden="true" className="flex">
                  {socialIcons[social.icon]}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </GridSection>
  )
}

export { SocialLinks }
export type { SocialLink }
