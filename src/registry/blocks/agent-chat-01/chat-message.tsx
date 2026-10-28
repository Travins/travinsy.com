"use client"

import { AgentChatMarkdown } from "./chat-markdown"
import { AgentChatSteps } from "./chat-trace"
import { useAgentContext } from "./agent-chat-context"
import { useState } from "react"
import type { UIMessage } from "ai"
import { Check, Copy, RotateCcw, ThumbsDown, ThumbsUp } from "lucide-react"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Message, MessageContent, MessageFooter } from "@/components/ui/message"

function messageText(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("")
}

function AgentChatMessage({
  message,
  live,
  busy,
  regenerate,
}: {
  message: UIMessage
  live: boolean
  busy: boolean
  regenerate: () => void
}) {
  const { labels } = useAgentContext()
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null)
  const [notice, setNotice] = useState("")
  const text = messageText(message)
  if (message.role === "user")
    return (
      <Message data-slot="agent-chat-message" data-role="user" align="end">
        <MessageContent>
          <Bubble align="end" variant="muted">
            <BubbleContent>{text}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    )
  return (
    <Message
      data-slot="agent-chat-message"
      data-role="assistant"
      data-state={live ? "streaming" : "idle"}
    >
      <MessageContent className="gap-4">
        <AgentChatSteps message={message} live={live} />
        {text ? (
          <Bubble variant="ghost">
            <BubbleContent>
              <AgentChatMarkdown text={text} />
            </BubbleContent>
          </Bubble>
        ) : null}
        {!live ? (
          <MessageFooter className="flex-wrap gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={labels.copy}
              disabled={!text}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(text)
                  setNotice(labels.copied)
                } catch {
                  setNotice(labels.copyFailed)
                }
              }}
            >
              {notice === labels.copied ? <Check /> : <Copy />}
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={labels.useful}
              aria-pressed={feedback === "up"}
              onClick={() => {
                setFeedback(feedback === "up" ? null : "up")
                setNotice(labels.feedback)
              }}
            >
              <ThumbsUp />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={labels.notUseful}
              aria-pressed={feedback === "down"}
              onClick={() => {
                setFeedback(feedback === "down" ? null : "down")
                setNotice(labels.feedback)
              }}
            >
              <ThumbsDown />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={labels.regenerate}
              disabled={busy}
              onClick={regenerate}
            >
              <RotateCcw />
            </Button>
            <span role="status" className="text-xs">
              {notice}
            </span>
          </MessageFooter>
        ) : null}
      </MessageContent>
    </Message>
  )
}

export { AgentChatMessage, messageText }
