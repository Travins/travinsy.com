"use client"

import * as React from "react"
import {
  ActivityIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  XCircleIcon,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import { formatLabel, resolveLabels, type AppShellLabels } from "./config"

type ServiceState = "healthy" | "warning" | "unavailable" | "unknown"

type ServiceStatus = {
  id: string
  label: string
  state: ServiceState
  detail?: string
}

type HeaderStatusProps = {
  services: ServiceStatus[]
  /** 最近一次检查时间的展示文字，例如「14:32:05」 */
  checkedAt?: string
  className?: string
  labels?: Partial<AppShellLabels>
}

// 状态靠「图标 + 文字」区分，颜色只用主题变量，换颜色主题后依然可辨
const stateStyles: Record<
  ServiceState,
  { label: keyof AppShellLabels; icon: LucideIcon; className: string }
> = {
  healthy: {
    label: "stateHealthy",
    icon: CheckCircle2Icon,
    className: "text-primary",
  },
  warning: {
    label: "stateWarning",
    icon: AlertTriangleIcon,
    className: "text-foreground",
  },
  unavailable: {
    label: "stateUnavailable",
    icon: XCircleIcon,
    className: "text-destructive",
  },
  unknown: {
    label: "stateUnknown",
    icon: CircleDashedIcon,
    className: "text-muted-foreground",
  },
}

const severity: ServiceState[] = ["unavailable", "warning", "unknown", "healthy"]

/** 顶栏服务状态：按钮显示整体状态，弹层列出各服务。数据由外部传入（轮询、SSE 等自行实现）。 */
function HeaderStatus({
  services,
  checkedAt,
  className,
  labels,
}: HeaderStatusProps) {
  const text = resolveLabels(labels)
  const overall =
    severity.find((state) => services.some((s) => s.state === state)) ??
    "unknown"
  const Overall = stateStyles[overall]
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            className={cn("gap-1.5 px-2 text-muted-foreground", className)}
            aria-label={formatLabel(
              text.serviceStatusAria,
              text[Overall.label]
            )}
          />
        }
      >
        <span className="relative flex size-4 items-center justify-center">
          <ActivityIcon aria-hidden="true" />
          <Overall.icon
            aria-hidden="true"
            className={cn(
              "absolute -top-1 -right-1 size-2.5 rounded-full bg-background",
              Overall.className
            )}
          />
        </span>
        <span className="hidden text-xs xl:inline">{text.serviceStatus}</span>
      </PopoverTrigger>
      <PopoverContent
        data-slot="app-shell-header-status"
        align="end"
        className="w-72 max-w-[calc(100vw-1rem)]"
      >
        <p className="text-sm font-medium">{text.serviceStatus}</p>
        <ul className="divide-y divide-border">
          {services.map((service) => {
            const state = stateStyles[service.state]
            return (
              <li key={service.id} className="py-2 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span>{service.label}</span>
                  <span
                    className={cn("flex items-center gap-1.5", state.className)}
                  >
                    <state.icon className="size-3.5" aria-hidden="true" />
                    {text[state.label]}
                  </span>
                </div>
                {service.detail ? (
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {service.detail}
                  </p>
                ) : null}
              </li>
            )
          })}
        </ul>
        {checkedAt ? (
          <p className="text-[11px] text-muted-foreground">
            {formatLabel(text.checkedAt, checkedAt)}
          </p>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}

export { HeaderStatus }
export type { HeaderStatusProps, ServiceState, ServiceStatus }
