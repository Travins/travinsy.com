/** 演示用假数据：替换成你自己的接口数据即可。 */

import {
  ActivityIcon,
  BellRingIcon,
  GlobeIcon,
  LayoutGridIcon,
  RadarIcon,
  TimerIcon,
  type LucideIcon,
} from "lucide-react"

import type { StatFormatOptions } from "@/registry/lib/data-display"

type EventStatus = "ok" | "warning" | "error"

type EventRow = {
  id: string
  app: string
  target: string
  status: EventStatus
  latency: string
  time: string
}

const events: EventRow[] = [
  { id: "e-1042", app: "订单中心", target: "POST /api/orders", status: "ok", latency: "128 ms", time: "14:32:05" },
  { id: "e-1041", app: "用户中心", target: "GET /api/profile", status: "ok", latency: "86 ms", time: "14:31:48" },
  { id: "e-1040", app: "支付网关", target: "POST /api/pay/notify", status: "error", latency: "超时", time: "14:30:12" },
  { id: "e-1039", app: "商品服务", target: "GET /api/items?page=1", status: "warning", latency: "1 420 ms", time: "14:28:57" },
  { id: "e-1038", app: "订单中心", target: "GET /api/orders/9021", status: "ok", latency: "97 ms", time: "14:27:33" },
  { id: "e-1037", app: "消息推送", target: "POST /api/push", status: "ok", latency: "212 ms", time: "14:26:10" },
  { id: "e-1036", app: "用户中心", target: "POST /api/login", status: "warning", latency: "960 ms", time: "14:24:41" },
  { id: "e-1035", app: "支付网关", target: "GET /api/pay/status", status: "ok", latency: "74 ms", time: "14:23:02" },
  { id: "e-1034", app: "商品服务", target: "GET /api/items/301", status: "ok", latency: "103 ms", time: "14:21:50" },
  { id: "e-1033", app: "消息推送", target: "GET /api/push/queue", status: "error", latency: "连接被拒绝", time: "14:19:26" },
  { id: "e-1032", app: "订单中心", target: "PUT /api/orders/9018", status: "ok", latency: "141 ms", time: "14:17:09" },
  { id: "e-1031", app: "用户中心", target: "GET /api/me", status: "ok", latency: "69 ms", time: "14:15:44" },
]

type StatItem = {
  id: string
  label: string
  value: number
  unit?: string
  /** 大号数字的格式 */
  format?: StatFormatOptions
  /** 较上一周期的变化，单位是百分点，或 deltaFormat 指定的其他口径 */
  delta: number
  deltaFormat?: StatFormatOptions
  /** 越低越好的指标（耗时、告警数）：下降用「好」的颜色 */
  invert?: boolean
  hint: string
  /** 近 24 小时每 2 小时一个点，共 12 个，用来画迷你走势 */
  trend: number[]
  icon: LucideIcon
}

const stats: StatItem[] = [
  {
    id: "availability",
    label: "可用率",
    value: 99.96,
    unit: "%",
    format: { compact: false, digits: 2 },
    delta: 0.02,
    deltaFormat: { digits: 2 },
    hint: "近 24 小时",
    trend: [99.91, 99.93, 99.9, 99.94, 99.95, 99.92, 99.94, 99.96, 99.95, 99.97, 99.96, 99.96],
    icon: ActivityIcon,
  },
  {
    id: "probes",
    label: "拨测次数",
    value: 128640,
    format: { compact: false },
    delta: 4.1,
    hint: "较昨日",
    trend: [8200, 8900, 9400, 10100, 10800, 11600, 12100, 11800, 12400, 13200, 13900, 14200],
    icon: RadarIcon,
  },
  {
    id: "latency",
    label: "平均响应",
    value: 132,
    unit: "ms",
    delta: -8,
    deltaFormat: { style: "number", digits: 0 },
    invert: true,
    hint: "ms · P50",
    trend: [141, 138, 145, 150, 148, 139, 142, 136, 134, 133, 131, 132],
    icon: TimerIcon,
  },
  {
    id: "alerts",
    label: "未恢复告警",
    value: 3,
    delta: 1,
    deltaFormat: { style: "number", digits: 0 },
    invert: true,
    hint: "需要处理",
    trend: [1, 1, 2, 1, 1, 2, 2, 3, 2, 2, 3, 3],
    icon: BellRingIcon,
  },
]

/** 24 个小时的响应耗时（ms），用来画简易柱状图 */
const latencySeries = [
  118, 124, 109, 131, 126, 140, 152, 148, 135, 129, 122, 118, 125, 133, 141,
  160, 172, 149, 138, 130, 127, 121, 116, 112,
]

/** 概览页标签条：value 与 events 的 app 字段对应，替换数据时一起改 */
const scopes = [
  { value: "all", label: "全局总览", icon: GlobeIcon },
  { value: "orders", label: "订单中心", icon: LayoutGridIcon },
  { value: "payments", label: "支付网关", icon: LayoutGridIcon },
]

/** 概览页标签条右侧的时间范围说明 */
const dateRange = "2025-06-01 ~ 2025-06-02"

const services = [
  { id: "probe", label: "拨测服务", state: "healthy" as const, detail: "全部节点在线" },
  { id: "worker", label: "任务调度", state: "warning" as const, detail: "队列积压 1 200 条，正在消化" },
  { id: "notify", label: "通知通道", state: "healthy" as const, detail: "站内信、邮件均可用" },
]

export {
  dateRange,
  events,
  latencySeries,
  scopes,
  services,
  stats,
}
export type { EventRow, EventStatus, StatItem }
