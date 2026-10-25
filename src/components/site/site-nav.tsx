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

/** ≥ md 的横向导航 */
export function SiteNav() {
  const isActive = useIsActive()

  return (
    <nav aria-label="主导航" className="hidden items-center gap-0.5 md:flex">
      {SITE_NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(item.href) ? "page" : undefined}
          className={cn(
            "rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
            isActive(item.href) && "text-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

/** < md 的菜单 */
export function MobileNav() {
  const isActive = useIsActive()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="打开导航菜单"
          />
        }
      >
        <MenuIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuGroup>
          {SITE_NAV.map((item) => (
            <DropdownMenuItem
              key={item.href}
              render={<Link href={item.href} />}
              className={cn(isActive(item.href) && "bg-muted font-medium")}
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
