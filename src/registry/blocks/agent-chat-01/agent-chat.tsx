"use client"

import {
  useEffect,
  useState,
  type CSSProperties,
  type ComponentProps,
  type ReactNode,
} from "react"
import { motion, useReducedMotion } from "motion/react"
import { cva } from "class-variance-authority"
import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import {
  AgentChatProvider,
  useAgentChat,
  useAgentContext,
} from "./agent-chat-context"
import { AgentChatBody } from "./agent-chat-body"
import { useAgentChatPosition } from "./use-agent-chat-position"
import type { AgentChatMode } from "./types"
import type { AgentChatLabels } from "./config"

const agentChatTriggerVariants = cva("", {
  variants: {
    variant: {
      fab: "fixed right-4 bottom-4 z-40 size-12 rounded-full shadow-lg",
      button: "",
    },
  },
})

function AgentChatTrigger({
  className,
  variant = "fab",
  ...props
}: Omit<ComponentProps<typeof Button>, "variant"> & {
  variant?: "fab" | "button"
}) {
  const { open, setOpen, mode, labels } = useAgentContext()
  if (variant === "fab" && (mode !== "floating" || open)) return null
  return (
    <Button
      data-slot="agent-chat-trigger"
      data-state={open ? "open" : "closed"}
      data-mode={mode}
      className={cn(agentChatTriggerVariants({ variant }), className)}
      variant={variant === "fab" ? "default" : "outline"}
      size={variant === "fab" ? "icon" : "sm"}
      aria-label={open ? labels.closeTrigger : labels.openTrigger}
      aria-expanded={open}
      {...props}
      onClick={(event) => {
        props.onClick?.(event)
        if (!event.defaultPrevented) setOpen(!open)
      }}
    >
      <MessageSquare />
      {variant === "button" ? labels.title : null}
    </Button>
  )
}

/** 从工作区发起一个上下文问题，仍使用 Provider 中的同一段会话。 */
function AgentChatSuggestion({
  question,
  children,
  className,
  ...props
}: ComponentProps<typeof Button> & { question: string; children?: ReactNode }) {
  const { chat, setOpen, updateScroll } = useAgentContext()
  const busy = chat.status === "streaming" || chat.status === "submitted"
  return (
    <Button
      data-slot="agent-chat-suggestion"
      variant="link"
      className={className}
      {...props}
      disabled={busy || props.disabled}
      onClick={(event) => {
        props.onClick?.(event)
        if (event.defaultPrevented) return
        setOpen(true)
        updateScroll({ follow: true })
        void chat.sendMessage({ text: question })
      }}
    >
      {children ?? question}
    </Button>
  )
}

function AgentChatPanel({
  className,
  id,
  draggable = true,
}: Pick<ComponentProps<"aside">, "className" | "id"> & {
  draggable?: boolean
}) {
  const { mode, open, setOpen, title, labels } = useAgentContext()
  const [mobile, setMobile] = useState(false)
  const [width, setWidth] = useState(400)
  const reduced = useReducedMotion()
  const movable = mode === "floating" && !mobile && draggable
  const { panelRef, position, headerProps, onMoveKeyDown, reset } =
    useAgentChatPosition({
      enabled: movable && open,
      active: mode === "floating" && !mobile && open,
    })
  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)")
    const update = () => setMobile(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])
  if (!open) return null
  if (mobile)
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          id={id}
          data-slot="agent-chat-panel"
          data-mode={mode}
          data-state="open"
          side="bottom"
          showCloseButton={false}
          className={cn(
            "h-[92dvh]! max-h-[92dvh] gap-0 rounded-t-2xl motion-reduce:transition-none",
            className,
          )}
        >
          <SheetTitle className="sr-only">{title}</SheetTitle>
          <AgentChatBody />
        </SheetContent>
      </Sheet>
    )
  return (
    <motion.aside
      ref={panelRef}
      data-draggable={movable || undefined}
      id={id}
      data-slot="agent-chat-panel"
      data-state="open"
      aria-label={title}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault()
          setOpen(false)
        }
      }}
      data-mode={mode}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.2 }}
      style={
        {
          "--agent-width": `${width}px`,
          ...(mode === "floating" && position
            ? {
                left: position.x,
                top: position.y,
                right: "auto",
                bottom: "auto",
              }
            : {}),
        } as CSSProperties
      }
      className={cn(
        "flex min-h-0 flex-col bg-background text-foreground data-[dragging]:cursor-grabbing data-[dragging]:select-none",
        mode === "embedded"
          ? "relative h-full w-(--agent-width) shrink-0 border-l border-edge"
          : "fixed right-4 bottom-4 z-40 h-[min(600px,calc(100dvh-2rem))] w-[400px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-edge shadow-xl",
        className,
      )}
    >
      {mode === "embedded" ? (
        <div
          data-slot="agent-chat-resize-handle"
          role="separator"
          aria-label={labels.resize}
          aria-orientation="vertical"
          aria-valuemin={320}
          aria-valuemax={640}
          aria-valuenow={width}
          tabIndex={0}
          className="absolute inset-y-0 -left-1 w-2 cursor-col-resize touch-none rounded select-none focus-visible:bg-primary/20 focus-visible:outline-none"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault()
              setWidth((value) =>
                Math.max(
                  320,
                  Math.min(640, value + (event.key === "ArrowLeft" ? 16 : -16)),
                ),
              )
            }
          }}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId)
            event.preventDefault()
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId))
              setWidth(
                Math.max(
                  320,
                  Math.min(
                    640,
                    event.currentTarget.parentElement!.getBoundingClientRect()
                      .right - event.clientX,
                  ),
                ),
              )
          }}
          onPointerUp={(event) => {
            event.currentTarget.releasePointerCapture(event.pointerId)
          }}
        />
      ) : null}
      <AgentChatBody
        draggable={movable}
        headerProps={headerProps}
        onMoveKeyDown={onMoveKeyDown}
        onResetPosition={reset}
      />
    </motion.aside>
  )
}

export {
  AgentChatProvider,
  AgentChatPanel,
  AgentChatTrigger,
  AgentChatSuggestion,
  useAgentChat,
  agentChatTriggerVariants,
}
export type { AgentChatMode, AgentChatLabels }
