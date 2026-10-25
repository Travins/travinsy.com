"use client"

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { useChat } from "@ai-sdk/react"
import type { ChatTransport, UIMessage } from "ai"
import { useControllableState } from "@/registry/hooks/use-controllable-state"
import {
  DEFAULT_LABELS,
  agentSuggestions,
  type AgentChatLabels,
} from "./config"
import type { AgentChatMode } from "./types"
import { createMockTransport } from "./mock-transport"

type ChatState = ReturnType<typeof useChat<UIMessage>>
type AgentContextValue = {
  mode: AgentChatMode
  setMode: (mode: AgentChatMode) => void
  toggleMode: () => void
  open: boolean
  setOpen: (open: boolean) => void
  chat: ChatState
  title: string
  labels: AgentChatLabels
  suggestions: string[]
  draft: string
  setDraft: (draft: string) => void
  scroll: { current: { top: number; follow: boolean } }
  updateScroll: (value: Partial<{ top: number; follow: boolean }>) => void
}
const AgentContext = createContext<AgentContextValue | null>(null)
function useAgentContext() {
  const context = useContext(AgentContext)
  if (!context) throw new Error("请在 AgentChatProvider 内使用助手组件")
  return context
}
function useAgentChat() {
  const { mode, setMode, toggleMode, open, setOpen } = useAgentContext()
  return { mode, setMode, toggleMode, open, setOpen }
}
function AgentChatProvider({
  children,
  mode: controlledMode,
  onModeChange,
  defaultMode = "floating",
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  transport,
  suggestions = agentSuggestions,
  title,
  labels: labelOverrides,
  initialMessages,
}: {
  children: ReactNode
  mode?: AgentChatMode
  onModeChange?: (mode: AgentChatMode) => void
  defaultMode?: AgentChatMode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  labels?: Partial<AgentChatLabels>
  defaultOpen?: boolean
  transport?: ChatTransport<UIMessage>
  suggestions?: string[]
  title?: string
  initialMessages?: UIMessage[]
}) {
  const [mode, setMode] = useControllableState({
    prop: controlledMode,
    defaultProp: defaultMode,
    onChange: onModeChange,
  })
  const [open, setOpen] = useControllableState({
    prop: controlledOpen,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  })
  const labels = { ...DEFAULT_LABELS, ...labelOverrides }
  const [draft, setDraft] = useState("")
  const [mock] = useState(createMockTransport)
  const scroll = useRef({ top: 0, follow: true })
  const updateScroll = (value: Partial<{ top: number; follow: boolean }>) => {
    scroll.current = { ...scroll.current, ...value }
  }
  const chat = useChat<UIMessage>({
    transport: transport ?? mock,
    messages: initialMessages,
  })
  return (
    <AgentContext.Provider
      value={{
        mode,
        setMode,
        toggleMode: () =>
          setMode((value) => (value === "embedded" ? "floating" : "embedded")),
        open,
        setOpen,
        chat,
        title: title ?? labels.title,
        labels,
        suggestions,
        draft,
        setDraft,
        scroll,
        updateScroll,
      }}
    >
      {children}
    </AgentContext.Provider>
  )
}

export { AgentChatProvider, useAgentChat, useAgentContext }
