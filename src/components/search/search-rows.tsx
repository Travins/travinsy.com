"use client"

import {
  BookOpenIcon,
  BotIcon,
  ComponentIcon,
  EllipsisIcon,
  FileIcon,
  FileTextIcon,
  HashIcon,
  HistoryIcon,
  BlocksIcon,
  LayoutTemplateIcon,
  PaletteIcon,
  TextQuoteIcon,
  type LucideIcon,
} from "lucide-react"
import { Fragment, memo, type MouseEvent } from "react"
import { Kbd } from "@/components/ui/kbd"
import type { SearchGroup } from "@/lib/search"
import type { Row } from "./search-model"
import type { Segment } from "./search-text"

const groupIcons: Record<SearchGroup, LucideIcon> = {
  入门: BookOpenIcon,
  组件: ComponentIcon,
  区块: BlocksIcon,
  模板: LayoutTemplateIcon,
  主题: PaletteIcon,
  Agent: BotIcon,
  博客: FileTextIcon,
  页面: FileIcon,
}

const rowBase =
  "group/row flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 outline-none aria-selected:bg-accent aria-selected:text-accent-foreground"
const iconMuted =
  "shrink-0 text-muted-foreground group-aria-selected/row:text-accent-foreground/80"

export function Snippet({ segments }: { segments: Segment[] }) {
  return segments.map((segment, index) => {
    let node: React.ReactNode = segment.match ? (
      <mark className="bg-transparent font-medium text-foreground underline decoration-primary/60 decoration-1 underline-offset-[3px]">
        {segment.text}
      </mark>
    ) : (
      segment.text
    )
    if (segment.code) {
      node = (
        <code className="rounded-sm bg-foreground/8 px-1 py-px font-mono text-[0.92em]">
          {node}
        </code>
      )
    }
    return <Fragment key={index}>{node}</Fragment>
  })
}

function EnterKey() {
  return (
    <Kbd
      aria-hidden
      className="ml-1 hidden shrink-0 bg-background/70 group-aria-selected/row:inline-flex max-sm:group-aria-selected/row:hidden"
    >
      ↵
    </Kbd>
  )
}

type ResultRowProps = {
  row: Row
  id: string
  selected: boolean
  onHover: (index: number) => void
  onOpen: (row: Row, event: MouseEvent) => void
}

function ResultRowImpl({ row, id, selected, onHover, onOpen }: ResultRowProps) {
  const common = {
    id,
    role: "option",
    "aria-selected": selected,
    "data-index": row.index,
    onMouseMove: () => onHover(row.index),
    onClick: (event: MouseEvent) => onOpen(row, event),
  } as const

  if (row.kind === "recent") {
    return (
      <div {...common} className={`${rowBase} h-9 text-sm`}>
        <HistoryIcon aria-hidden className={`size-4 ${iconMuted}`} />
        <span className="min-w-0 flex-1 truncate">{row.query}</span>
        <EnterKey />
      </div>
    )
  }

  if (row.kind === "page" || row.kind === "shortcut") {
    const Icon = groupIcons[row.group]
    return (
      <a
        {...common}
        href={row.url}
        tabIndex={-1}
        className={`${rowBase} h-9 text-sm`}
      >
        <Icon aria-hidden className={`size-4 ${iconMuted}`} />
        <span
          className={`min-w-0 truncate ${row.kind === "page" ? "font-medium" : ""}`}
        >
          {row.kind === "page" ? <Snippet segments={row.title} /> : row.title}
        </span>
        <span className="ml-auto max-w-[45%] min-w-0 truncate pl-3 font-mono text-xs text-muted-foreground group-aria-selected/row:text-accent-foreground/70 max-sm:hidden">
          {row.path}
        </span>
        <EnterKey />
      </a>
    )
  }

  if (row.kind === "more") {
    return (
      <a
        {...common}
        href={row.url}
        tabIndex={-1}
        className={`${rowBase} h-7 text-xs text-muted-foreground group-aria-selected/row:text-accent-foreground`}
      >
        <EllipsisIcon aria-hidden className={`size-3.5 ${iconMuted}`} />
        <span className="flex-1">还有 {row.count} 处匹配</span>
        <EnterKey />
      </a>
    )
  }

  const Icon = row.kind === "heading" ? HashIcon : TextQuoteIcon
  return (
    <a
      {...common}
      href={row.url}
      tabIndex={-1}
      className={`${rowBase} h-8 gap-2 text-[13px] ${row.kind === "text" ? "text-muted-foreground group-aria-selected/row:text-accent-foreground/80" : ""}`}
    >
      <Icon aria-hidden className={`size-3.5 ${iconMuted}`} />
      <span className="min-w-0 flex-1 truncate">
        <Snippet segments={row.segments} />
      </span>
      <EnterKey />
    </a>
  )
}

export const ResultRow = memo(ResultRowImpl)
