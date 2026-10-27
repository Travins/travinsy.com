import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
  flowToneStyle,
  type FlowToneName,
} from "@/registry/ui/flow-diagram/tone"
import "./timeline.css"

type TimelineStatus = "done" | "current" | "upcoming"
type TimelineOrientation = "vertical" | "horizontal"
type TimelineAlign = "start" | "alternate"

function Timeline({
  className,
  orientation = "vertical",
  align = "start",
  ...props
}: React.ComponentProps<"ol"> & {
  orientation?: TimelineOrientation
  /** 仅竖向时间线在宽屏交替排列。 */
  align?: TimelineAlign
}) {
  return (
    <ol
      data-slot="timeline"
      data-orientation={orientation}
      data-align={align}
      className={cn("isolate m-0 w-full list-none p-0", className)}
      {...props}
    />
  )
}

function TimelineItem({
  className,
  status = "done",
  time,
  children,
  ...props
}: React.ComponentProps<"li"> & {
  status?: TimelineStatus
  /** 左侧编号栏；建议传入 TimelineTime。 */
  time?: React.ReactNode
}) {
  return (
    <li
      data-slot="timeline-item"
      data-status={status}
      data-time={time ? "column" : undefined}
      aria-current={status === "current" ? "step" : undefined}
      className={cn("group/timeline-item relative min-w-0", className)}
      {...props}
    >
      {time ? <div data-slot="timeline-item-time">{time}</div> : null}
      {children}
    </li>
  )
}

const timelineMarkerVariants = cva(
  "relative z-10 flex size-8 shrink-0 items-center justify-center self-start rounded-full border border-edge bg-background font-mono text-xs text-(--flow-tone) [&_svg]:size-3.5",
  {
    variants: {
      status: {
        done: "",
        current: "ring-4 ring-(--flow-tone)/10 motion-safe:animate-pulse",
        upcoming: "border-dashed text-muted-foreground",
      },
    },
    defaultVariants: { status: "done" },
  },
)

function TimelineMarker({
  className,
  tone = "primary",
  status,
  style,
  children,
  label,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof timelineMarkerVariants> & {
    tone?: FlowToneName
    /** 有语义的标记请提供文字说明。 */
    label?: string
  }) {
  return (
    <span
      data-slot="timeline-marker"
      data-status={status ?? undefined}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(timelineMarkerVariants({ status }), className)}
      style={{ ...flowToneStyle(tone), ...style }}
      {...props}
    >
      {children ?? (
        <span
          data-slot="timeline-dot"
          className="size-2 rounded-full bg-current"
        />
      )}
    </span>
  )
}

function TimelineConnector({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="timeline-connector"
      aria-hidden="true"
      className={cn("pointer-events-none border-edge", className)}
      {...props}
    />
  )
}

function TimelineContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-content"
      className={cn("min-w-0 pt-1 pb-8", className)}
      {...props}
    />
  )
}

function TimelineTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="timeline-title"
      className={cn(
        "m-0 text-sm leading-6 font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  )
}

function TimelineTime({ className, ...props }: React.ComponentProps<"time">) {
  return (
    <time
      data-slot="timeline-time"
      className={cn(
        "shrink-0 font-mono text-xs leading-6 text-muted-foreground tabular-nums",
        className,
      )}
      {...props}
    />
  )
}

function TimelineDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="timeline-description"
      className={cn(
        "mt-1 mb-0 text-[13px] leading-7 text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}

function TimelineAttachment({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-attachment"
      className={cn(
        "mt-3 flex flex-wrap items-center gap-2 text-xs",
        className,
      )}
      {...props}
    />
  )
}

export {
  Timeline,
  TimelineItem,
  TimelineMarker,
  TimelineConnector,
  TimelineContent,
  TimelineTitle,
  TimelineTime,
  TimelineDescription,
  TimelineAttachment,
  timelineMarkerVariants,
}
export type { TimelineStatus, TimelineOrientation, TimelineAlign }
