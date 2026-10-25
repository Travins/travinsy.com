"use client"

import type { ReactNode } from "react"

import { AppShell } from "@/registry/templates/app-shell-01/app-shell"
import { HeaderStatus } from "@/registry/templates/app-shell-01/header-status"
import { navConfig } from "@/registry/templates/app-shell-01/nav-config"
import { services } from "@/registry/templates/app-shell-01/sample-data"

/**
 * 控制台布局：app/(app) 路由组下的所有页面都会套上这层壳。
 * 导航数据里的图标是函数，不能从服务端组件传给客户端组件，所以这个布局是客户端组件。
 * 把 brand、user、onSignOut 换成你自己的数据与登录逻辑。
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      nav={navConfig}
      brand={{ name: "Acme 控制台", tagline: "企业级监控与运维", href: "/dashboard" }}
      user={{ name: "管理员", email: "admin@example.com" }}
      onSignOut={() => {
        // TODO: 调用你的认证服务退出登录，然后跳转到 /login
      }}
      headerActions={<HeaderStatus services={services} />}
    >
      {children}
    </AppShell>
  )
}
