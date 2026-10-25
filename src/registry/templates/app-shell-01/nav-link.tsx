"use client"

import * as React from "react"
import Link from "next/link"

/** 导航链接的统一行为，由 AppShell 创建后往下传。 */
type NavLinkBehavior = {
  /** 点击任一导航链接后触发：关闭移动端抽屉、通知外部当前地址等 */
  onNavigate?: (payload: { href: string }) => void
  /** 为 true 时拦截浏览器默认跳转，由 onNavigate 自行处理（预览、单页演示用） */
  intercept?: boolean
}

type NavLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> & {
  href: string
  navigation?: NavLinkBehavior
}

/** 对 next/link 的薄封装：保留 Cmd/Ctrl 点击等原生行为，只处理普通左键点击。 */
function NavLink({ href, navigation, onClick, ...props }: NavLinkProps) {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }
    if (navigation?.intercept) event.preventDefault()
    navigation?.onNavigate?.({ href })
  }
  return (
    <Link
      data-slot="app-shell-nav-link"
      href={href}
      onClick={handleClick}
      {...props}
    />
  )
}

export { NavLink }
export type { NavLinkBehavior, NavLinkProps }
