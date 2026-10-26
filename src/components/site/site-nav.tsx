"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon } from "lucide-react"

import { SITE_NAV } from "@/components/site/site-config"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

function useIsActive() {
  const pathname = usePathname()
  return (href: string) => {
    const base = href.replace(/\/$/, "")
    return pathname === base || pathname.startsWith(`${base}/`)
  }
}

/**
 * ≥ md 的横向导航：每项占满页头高度，中文在上、小号等宽英文在下。
 * 底部指示线压在页头底线上：当前项主色常显，悬停时淡色滑入。
 */
export function SiteNav() {
  const isActive = useIsActive()

  return (
    <nav aria-label="主导航" className="hidden items-stretch whitespace-nowrap lg:flex">
      {SITE_NAV.map((item) => {
        const active = isActive(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            data-active={active ? "" : undefined}
            className={cn(
              "group/nav relative z-10 flex flex-col items-center justify-center gap-0.5 rounded-sm px-2.5 text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-inset lg:px-3.5",
              "after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-foreground/25 after:transition-transform after:duration-200 hover:after:scale-x-100 focus-visible:after:scale-x-100 motion-reduce:after:transition-none",
              active &&
                "text-foreground after:scale-x-100 after:bg-primary hover:after:bg-primary"
            )}
          >
            <span className="text-sm leading-5 font-medium">{item.label}</span>
            <span
              aria-hidden
              className={cn(
                "font-mono text-[0.625rem] leading-3 tracking-[0.08em] uppercase transition-colors",
                active && "text-primary"
              )}
            >
              {item.labelEn}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

/** < md 的菜单：序号 + 中文 + 右对齐的英文，当前项左侧主色竖线。 */
export function MobileNav() {
  const isActive = useIsActive()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="打开导航菜单"
          />
        }
      >
        <MenuIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-60">
        <DropdownMenuGroup>
          {SITE_NAV.map((item, index) => {
            const active = isActive(item.href)
            return (
              <DropdownMenuItem
                key={item.href}
                render={
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                  />
                }
                className={cn(
                  "gap-3 py-2 pr-2.5 pl-3.5",
                  active &&
                    "bg-muted before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-primary"
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "w-4 font-mono text-[0.625rem] text-muted-foreground tabular-nums",
                    active && "text-primary"
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={cn("text-sm", active && "font-medium")}>
                  {item.label}
                </span>
                <span
                  aria-hidden
                  className="ml-auto font-mono text-[0.625rem] tracking-[0.08em] text-muted-foreground uppercase"
                >
                  {item.labelEn}
                </span>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
