"use client"

import * as React from "react"

import {
  AgentChatPanel,
  AgentChatProvider,
  AgentChatTrigger,
} from "@/registry/blocks/agent-chat-01/agent-chat"

import { AppShell } from "./app-shell"
import { DashboardOverview } from "./dashboard-overview"
import { HeaderStatus } from "./header-status"
import { ListPage } from "./list-page"
import { navConfig } from "./nav-config"
import { resolveNav } from "./nav-types"
import { services } from "./sample-data"

/**
 * 预览用演示：/view 里没有对应路由，所以用本地 state 模拟导航，
 * 通过 activeHref + onNavigate 驱动高亮与页面内容。
 * aside 插槽接入 agent-chat-01：嵌入模式挂在 main 右侧，切到浮动后变成右下角窗口。
 */
export default function AppShell01Demo() {
  const [href, setHref] = React.useState("/dashboard")
  const active = resolveNav(navConfig, href)

  return (
    <AgentChatProvider defaultMode="embedded" defaultOpen>
      <AppShell
        nav={navConfig}
        brand={{
          name: "Acme 控制台",
          tagline: "企业级监控与运维",
          href: "/dashboard",
        }}
        user={{ name: "管理员", email: "admin@example.com" }}
        activeHref={href}
        onNavigate={({ href: next }) => setHref(next)}
        headerActions={
          <>
            <HeaderStatus services={services} checkedAt="14:32:05" />
            <AgentChatTrigger variant="button" />
          </>
        }
        aside={<AgentChatPanel />}
      >
        {active?.item.id === "overview" || !active ? (
          <DashboardOverview />
        ) : (
          <ListPage
            key={active.item.id}
            section={active.trail.at(-2)}
            title={active.item.label}
            description={active.item.description}
          />
        )}
      </AppShell>
      <AgentChatTrigger />
    </AgentChatProvider>
  )
}
