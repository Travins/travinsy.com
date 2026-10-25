import {
  Activity,
  BellRing,
  BookOpen,
  ClipboardList,
  FileText,
  Gauge,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  Radar,
  ScrollText,
  Server,
  Settings,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react"

import type { NavConfig } from "./nav-types"

/**
 * 导航数据集中在这里：改这个文件就能换掉整套导航。
 *
 * - sections[].entries 里的叶子条目 → 一级导航里的一行，点击直接跳转；
 * - 带 items 的条目是「模块」→ 一级导航里的一行，进入后出现二级（工作区）侧栏；
 * - footer 固定在一级导航底部。
 * 图标统一用 lucide-react。
 */
const navConfig: NavConfig = {
  sections: [
    {
      id: "workspace",
      label: "工作台",
      entries: [
        {
          id: "overview",
          label: "概览",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          id: "records",
          label: "拨测记录",
          href: "/dashboard/records",
          icon: FileText,
        },
        {
          id: "interfaces",
          label: "接口探测",
          href: "/dashboard/interfaces",
          icon: Radar,
        },
        {
          id: "nodes",
          label: "节点监控",
          href: "/dashboard/nodes",
          icon: Server,
        },
        {
          id: "events",
          label: "事件与异常",
          href: "/dashboard/events",
          icon: Activity,
        },
      ],
    },
    {
      id: "management",
      label: "业务管理",
      entries: [
        {
          id: "operations",
          label: "运维管理",
          icon: Wrench,
          description: "告警、通知与维护配置",
          items: [
            {
              id: "alert-rules",
              label: "告警规则",
              href: "/dashboard/operations/alert-rules",
              icon: Gauge,
              description: "告警条件与站内提醒",
            },
            {
              id: "incidents",
              label: "告警事件",
              href: "/dashboard/operations/incidents",
              icon: BellRing,
              description: "触发周期与恢复记录",
              badge: 3,
            },
            {
              id: "maintenance",
              label: "维护窗口",
              href: "/dashboard/operations/maintenance",
              icon: ClipboardList,
              description: "维护范围与抑制时段",
            },
          ],
        },
        {
          id: "system",
          label: "系统管理",
          icon: ShieldCheck,
          description: "账号、权限与系统设置",
          items: [
            {
              id: "users",
              label: "用户管理",
              href: "/dashboard/system/users",
              icon: Users,
              description: "账号与角色分配",
            },
            {
              id: "roles",
              label: "角色权限",
              href: "/dashboard/system/roles",
              icon: KeyRound,
              description: "访问权限与首页模块",
            },
            {
              id: "settings",
              label: "系统配置",
              href: "/dashboard/system/settings",
              icon: Settings,
              description: "平台配置与运行约定",
            },
            {
              id: "audit-logs",
              label: "审计日志",
              href: "/dashboard/system/audit-logs",
              icon: ScrollText,
              description: "操作记录与完整上下文",
            },
          ],
        },
      ],
    },
  ],
  footer: {
    id: "resources",
    label: "资源与帮助",
    entries: [
      {
        id: "docs",
        label: "使用文档",
        href: "/dashboard/docs",
        icon: BookOpen,
      },
      {
        id: "support",
        label: "帮助与反馈",
        href: "/dashboard/support",
        icon: LifeBuoy,
      },
    ],
  },
}

export { navConfig }
