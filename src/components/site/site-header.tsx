import { NavigationProgress } from "./navigation-progress"
import Link from "next/link"

import { SearchButton } from "@/components/search/search-button"
import { GithubIcon } from "@/components/site/github-icon"
import { ModeToggle } from "@/components/site/mode-toggle"
import { GITHUB_URL, SITE_NAME } from "@/components/site/site-config"
import { SiteLogo } from "@/components/site/site-logo"
import { profile } from "@/config/profile"
import { MobileNav, SiteNav } from "@/components/site/site-nav"
import { ThemeSwitcher } from "@/components/site/theme-switcher"
import { buttonVariants } from "@/components/ui/button"
import { GridContainer } from "@/registry/ui/grid-layout/grid-layout"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      {/* screen-line-bottom 自带 position: relative，所以放在内层，避免和 sticky 冲突 */}
      <div className="screen-line-bottom">
        {/* 高度取 --header-height（globals.css）；Logo 靠左，菜单与工具区靠右，导航项占满整高 */}
        <GridContainer className="flex h-(--header-height) items-stretch gap-2 px-4">
          {/*
            标志 + 字标：上行是组件库名 Yi UI，下行小号等宽注明作者 Travins，
            与右侧导航「中文在上、等宽英文在下」的两行写法呼应
          */}
          <Link
            href="/"
            aria-label={`Yi UI，${SITE_NAME} 首页`}
            className="group/logo flex shrink-0 items-center gap-2.5 rounded-md pr-3 text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <SiteLogo className="transition-transform duration-200 motion-safe:group-hover/logo:-rotate-3" />
            <span aria-hidden="true" className="flex flex-col leading-none">
              <span className="text-[17px] font-semibold tracking-tight">
                Yi UI
              </span>
              <span className="mt-1 font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
                by {profile.name}
              </span>
            </span>
          </Link>

          {/* 菜单靠右，与右侧工具图标之间用一条整高竖线隔开 */}
          <div className="ml-auto flex items-stretch">
            <SiteNav />
          </div>
          <span
            aria-hidden="true"
            className="hidden w-px self-stretch bg-edge lg:block"
          />

          <div className="flex items-center gap-1 lg:pl-2">
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
      <NavigationProgress />
    </header>
  )
}
