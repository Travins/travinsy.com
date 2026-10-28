"use client"

import { useEffect, useState, type ComponentProps } from "react"
import { isToolUIPart, getToolName, type UIMessage } from "ai"
import {
  Ban,
  Brain,
  Check,
  ChevronRight,
  ExternalLink,
  LoaderCircle,
  X,
} from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import { cn } from "@/lib/utils"
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineMarker,
  TimelineTitle,
} from "@/registry/ui/timeline/timeline"
import { useAgentContext } from "./agent-chat-context"

type MessagePart = UIMessage["parts"][number]

function safeSource(url: string) {
  try {
    const parsed = new URL(url)
    return ["https:", "http:"].includes(parsed.protocol)
      ? parsed.href
      : undefined
  } catch {
    return undefined
  }
}

/** 是否属于时间线上的一步：分析摘要、工具调用、可打开的来源。 */
function isStepPart(part: MessagePart) {
  if (part.type === "reasoning" || isToolUIPart(part)) return true
  return part.type === "source-url" && safeSource(part.url) !== undefined
}

/** 标题行：整行是展开按钮，外面套 TimelineTitle 的 h3，保证标题语义。 */
function StepToggle({
  running = false,
  children,
  ...props
}: ComponentProps<typeof CollapsibleTrigger> & { running?: boolean }) {
  return (
    <TimelineTitle>
      <CollapsibleTrigger
        data-slot="agent-chat-step-toggle"
        className="group/step-toggle flex w-fit max-w-full min-w-0 cursor-pointer items-center gap-1 rounded-md text-left text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        {...props}
      >
        <span
          className={cn(
            "min-w-0 truncate",
            running && "shimmer motion-reduce:shimmer-none",
          )}
        >
          {children}
        </span>
        <ChevronRight
          aria-hidden="true"
          className="size-4 shrink-0 transition-transform group-aria-expanded/step-toggle:rotate-90 motion-reduce:transition-none"
        />
      </CollapsibleTrigger>
    </TimelineTitle>
  )
}

function StepPanel({ className, ...props }: ComponentProps<"div">) {
  return (
    <CollapsibleContent className="h-(--collapsible-panel-height) min-w-0 overflow-hidden transition-[height] duration-200 data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none">
      <div
        className={cn("mt-2 min-w-0 wrap-break-word", className)}
        {...props}
      />
    </CollapsibleContent>
  )
}

function ReasoningStep({
  text,
  running,
  interrupted,
}: {
  text: string
  running: boolean
  interrupted: boolean
}) {
  const { labels } = useAgentContext()
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    if (!running) return
    const started = Date.now()
    const timer = setInterval(
      () => setSeconds((Date.now() - started) / 1000),
      100,
    )
    return () => clearInterval(timer)
  }, [running])
  return (
    // 不能覆盖 data-slot：timeline.css 靠它给每一步排网格
    <TimelineItem status={running ? "current" : "done"}>
      <TimelineMarker tone="violet">
        {running ? (
          <LoaderCircle className="animate-spin motion-reduce:animate-none" />
        ) : (
          <Brain />
        )}
      </TimelineMarker>
      <TimelineConnector />
      <TimelineContent className="pb-4">
        <Collapsible className="min-w-0">
          <StepToggle running={running}>
            {running
              ? labels.thinking
              : interrupted
                ? labels.thinkingStopped
                : seconds === 0
                  ? labels.reasoningSummary
                  : labels.thought.replace(
                      "{seconds}",
                      new Intl.NumberFormat(undefined, {
                        maximumFractionDigits: 1,
                      }).format(seconds),
                    )}
          </StepToggle>
          <StepPanel className="text-sm leading-7 text-muted-foreground">
            {text || labels.preparing}
          </StepPanel>
        </Collapsible>
      </TimelineContent>
    </TimelineItem>
  )
}

function ToolStep({
  part,
  live,
}: {
  part: Extract<MessagePart, { type: `tool-${string}` | "dynamic-tool" }>
  live: boolean
}) {
  const { labels } = useAgentContext()
  const done = part.state === "output-available"
  const failed = part.state === "output-error" || part.state === "output-denied"
  const running = live && !done && !failed
  const stopped = !running && !done && !failed
  const label = `${running ? labels.running : done ? labels.completed : failed ? labels.failed : labels.stopped} · ${getToolName(part)}`
  return (
    <TimelineItem status={running ? "current" : stopped ? "upcoming" : "done"}>
      <TimelineMarker
        tone={
          failed
            ? "destructive"
            : done
              ? "green"
              : running
                ? "primary"
                : "muted"
        }
      >
        {running ? (
          <LoaderCircle className="animate-spin motion-reduce:animate-none" />
        ) : done ? (
          <Check />
        ) : failed ? (
          <X />
        ) : (
          <Ban />
        )}
      </TimelineMarker>
      <TimelineConnector />
      <TimelineContent className="pb-4">
        <Collapsible className="min-w-0">
          <StepToggle running={running}>{label}</StepToggle>
          <StepPanel className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground">{labels.toolInput}</p>
            <CodeBlock size="sm">
              <CodeBlockContent wrap>
                {JSON.stringify(part.input ?? {}, null, 2)}
              </CodeBlockContent>
            </CodeBlock>
            <p className="text-xs text-muted-foreground">{labels.toolOutput}</p>
            <CodeBlock size="sm" variant={failed ? "destructive" : "default"}>
              <CodeBlockContent wrap>
                {part.state === "output-error"
                  ? part.errorText
                  : done
                    ? JSON.stringify(part.output, null, 2)
                    : part.state === "output-denied"
                      ? labels.denied
                      : running
                        ? labels.waiting
                        : labels.incomplete}
              </CodeBlockContent>
            </CodeBlock>
          </StepPanel>
        </Collapsible>
      </TimelineContent>
    </TimelineItem>
  )
}

function SourceStep({ title, href }: { title?: string; href: string }) {
  const { labels } = useAgentContext()
  return (
    <TimelineItem>
      <TimelineMarker tone="blue">
        <ExternalLink />
      </TimelineMarker>
      <TimelineConnector />
      <TimelineContent className="pb-4">
        <TimelineTitle className="text-sm">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {title ?? new URL(href).hostname}
            <span className="sr-only">{labels.newTab}</span>
          </a>
        </TimelineTitle>
      </TimelineContent>
    </TimelineItem>
  )
}

/**
 * 助手回复上方的分析过程：分析摘要、工具调用和参考来源按顺序排成竖向时间线。
 * 进行中的一步是 current（脉冲光环），已停止的是 upcoming（虚线）；没有任何一步时不渲染。
 */
function AgentChatSteps({
  message,
  live,
}: {
  message: UIMessage
  live: boolean
}) {
  const { labels } = useAgentContext()
  if (!message.parts.some(isStepPart)) return null
  return (
    <Timeline data-slot="agent-chat-steps" aria-label={labels.steps}>
      {message.parts.map((part, index) => {
        if (part.type === "reasoning")
          return (
            <ReasoningStep
              key={index}
              text={part.text}
              running={live && part.state === "streaming"}
              interrupted={!live && part.state === "streaming"}
            />
          )
        if (isToolUIPart(part))
          return <ToolStep key={part.toolCallId} part={part} live={live} />
        if (part.type === "source-url") {
          const href = safeSource(part.url)
          return href ? (
            <SourceStep key={part.sourceId} title={part.title} href={href} />
          ) : null
        }
        return null
      })}
    </Timeline>
  )
}

export { AgentChatSteps }
