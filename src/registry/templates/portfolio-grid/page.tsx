import { Bot, Code2, Layers, Server } from "lucide-react"
import type { Metadata } from "next"
import type { ReactNode } from "react"

import { FeatureColumns } from "@/registry/blocks/feature-columns/feature-columns"
import { ProfileHero } from "@/registry/blocks/profile-hero/profile-hero"
import { AboutSection } from "@/registry/templates/portfolio-grid/components/portfolio/about-section"
import { SiteFooter } from "@/registry/templates/portfolio-grid/components/portfolio/site-footer"
import { SiteHeader } from "@/registry/templates/portfolio-grid/components/portfolio/site-header"
import { SocialLinks } from "@/registry/templates/portfolio-grid/components/portfolio/social-links"
import { StackSection } from "@/registry/templates/portfolio-grid/components/portfolio/stack-section"
import {
  siteConfig,
  type FocusIcon,
} from "@/registry/templates/portfolio-grid/lib/site.config"
import {
  GridContainer,
  GridSeparator,
} from "@/registry/ui/grid-layout/grid-layout"

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.bio,
}

const focusIcons: Record<FocusIcon, ReactNode> = {
  code: <Code2 strokeWidth={1.5} />,
  bot: <Bot strokeWidth={1.5} />,
  server: <Server strokeWidth={1.5} />,
  layout: <Layers strokeWidth={1.5} />,
}

/** 线条网格个人主页：所有内容来自 lib/site.config.ts，一般只需要改那个文件。 */
export default function Page() {
  return (
    <>
      <SiteHeader />
      <main data-slot="portfolio-grid">
        <GridContainer>
          <ProfileHero
            name={siteConfig.name}
            bio={siteConfig.bio}
            roles={siteConfig.roles}
            initials={siteConfig.initials}
            tagline={siteConfig.tagline}
          />
          <SocialLinks socials={siteConfig.socials} />
          <FeatureColumns
            title={siteConfig.focus.title}
            items={siteConfig.focus.items.map((item) => ({
              title: item.title,
              description: item.description,
              icon: focusIcons[item.icon],
            }))}
            id="focus"
            className="scroll-mt-16"
          />
          <StackSection
            title={siteConfig.stack.title}
            items={siteConfig.stack.items}
          />
          <GridSeparator />
          <AboutSection
            title={siteConfig.about.title}
            paragraphs={siteConfig.about.paragraphs}
          />
        </GridContainer>
      </main>
      <SiteFooter />
    </>
  )
}
