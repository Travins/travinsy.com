"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCardStack } from "./context"

function CardStackControls({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { index, count, mode, paused, setPaused, labels, go } = useCardStack()
  return (
    <div
      data-slot="card-stack-controls"
      className={cn(
        "mt-5 flex flex-wrap items-center justify-center gap-1",
        className,
      )}
      {...props}
    >
      <Button
        size="icon-sm"
        variant="ghost"
        aria-label={labels.previous}
        disabled={count < 2}
        onClick={() => go(index - 1)}
      >
        <ArrowLeft aria-hidden="true" />
      </Button>
      {Array.from({ length: count }, (_, item) => (
        <Button
          key={item}
          size="icon-sm"
          variant="ghost"
          aria-label={`${labels.card} ${item + 1}`}
          aria-pressed={index === item}
          onClick={() => go(item)}
        >
          <span
            data-slot="card-stack-indicator"
            aria-hidden="true"
            className={cn(
              "size-1.5 rounded-full bg-muted-foreground/30",
              item === index && "bg-primary",
            )}
          />
        </Button>
      ))}
      <Button
        size="icon-sm"
        variant="ghost"
        aria-label={labels.next}
        disabled={count < 2}
        onClick={() => go(index + 1)}
      >
        <ArrowRight aria-hidden="true" />
      </Button>
      {mode === "auto" ? (
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label={paused ? labels.play : labels.pause}
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        </Button>
      ) : null}
    </div>
  )
}

export { CardStackControls }
