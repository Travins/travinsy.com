"use client"
import * as React from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Timeline,
  TimelineItem,
  TimelineMarker,
  TimelineConnector,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
  TimelineTime,
} from "@/registry/ui/timeline/timeline"
import { DEFAULT_LABELS, money } from "./config"
import type { CheckoutTimelineItem } from "./types"

function CheckoutProgress({ items }: { items: CheckoutTimelineItem[] }) {
  return (
    <Timeline data-slot="checkout-progress">
      {items.map((item, i) => {
        const status = item.status ?? "done"
        return (
          <TimelineItem key={i} status={status}>
            <TimelineMarker
              status={status}
              tone={status === "done" ? "primary" : "muted"}
            >
              {status === "done" ? <Check /> : i + 1}
            </TimelineMarker>
            {i < items.length - 1 && <TimelineConnector />}
            <TimelineContent
              className={
                "pb-4 " + (status === "upcoming" ? "text-muted-foreground" : "")
              }
            >
              <div className="flex items-baseline justify-between gap-2">
                <TimelineTitle>{item.title}</TimelineTitle>
                {item.time && (
                  <TimelineTime className="font-mono text-xs">
                    {item.time}
                  </TimelineTime>
                )}
              </div>
              {item.description && (
                <TimelineDescription>{item.description}</TimelineDescription>
              )}
            </TimelineContent>
          </TimelineItem>
        )
      })}
    </Timeline>
  )
}
function CheckoutCompletion({
  orderId,
  total,
  payment,
  items,
  labels,
  onViewOrder,
  onContinue,
}: {
  orderId: string
  total: number
  payment?: string
  items: CheckoutTimelineItem[]
  labels?: Partial<typeof DEFAULT_LABELS>
  onViewOrder?: () => void
  onContinue?: () => void
}) {
  const t = { ...DEFAULT_LABELS, ...labels }
  const [copyState, setCopyState] = React.useState<"idle" | "done" | "failed">(
    "idle",
  )
  return (
    <div
      data-slot="checkout-completion"
      className="mx-auto grid w-full max-w-md gap-6 rounded-xl border border-edge bg-card p-6 text-card-foreground sm:p-8"
    >
      <div className="grid justify-items-center gap-3 text-center">
        <span
          data-slot="checkout-success-badge"
          className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary"
        >
          <Check className="size-8" />
        </span>
        <h2 className="text-2xl font-semibold">{t.success}</h2>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>{t.orderId}</span>
          <span className="font-mono text-foreground">{orderId}</span>
          <Button
            variant="ghost"
            size="icon"
            aria-label={copyState === "done" ? t.copied : t.copy}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(orderId)
                setCopyState("done")
              } catch {
                setCopyState("failed")
              }
            }}
          >
            {copyState === "done" ? <Check /> : <Copy />}
          </Button>
        </div>
        <span role="status" className="sr-only">
          {copyState === "done"
            ? t.copied
            : copyState === "failed"
              ? t.copyFailed
              : ""}
        </span>
        <p className="text-xs text-muted-foreground">{t.total}</p>
        <p className="font-mono text-4xl font-semibold tracking-tight">
          {money(total)}
        </p>
        <p className="text-sm text-muted-foreground">{payment}</p>
      </div>
      <div className="border-t border-edge pt-6">
        <CheckoutProgress items={items} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button size="default" onClick={onViewOrder}>
          {t.view}
        </Button>
        <Button size="default" variant="outline" onClick={onContinue}>
          {t.continue}
        </Button>
      </div>
    </div>
  )
}
export { CheckoutProgress, CheckoutCompletion }
