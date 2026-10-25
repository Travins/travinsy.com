import Link from "next/link"

import { SearchButton } from "@/components/search/search-button"
import { GithubIcon } from "@/components/site/github-icon"
import { ModeToggle } from "@/components/site/mode-toggle"
import { GITHUB_URL, SITE_NAME } from "@/components/site/site-config"
import { MobileNav, SiteNav } from "@/components/site/site-nav"
import { ThemeSwitcher } from "@/components/site/theme-switcher"
import { buttonVariants } from "@/components/ui/button"
import { GridContainer } from "@/registry/ui/grid-layout/grid-layout"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      {/* screen-line-bottom 自带 position: relative，所以放在内层，避免和 sticky 冲突 */}
      <div className="screen-line-bottom">
        <GridContainer className="flex h-14 items-center justify-between gap-2 px-4">
          <Link
            href="/"
            className="rounded-md font-mono text-sm font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {SITE_NAME}
          </Link>

          <div className="flex items-center gap-1">
            <SiteNav />
            <span aria-hidden className="mx-1 hidden h-4 w-px bg-edge md:block" />
            <SearchButton />
            <ThemeSwitcher />
            <ModeToggle />
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <GithubIcon />
            </a>
            <MobileNav />
          </div>
        </GridContainer>
      </div>
    </header>
  )
}
