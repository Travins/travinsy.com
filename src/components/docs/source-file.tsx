"use client"

import { useId, useState, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CopyButton } from "./copy-button"
import { DocFrame, DocFrameBar } from "./doc-frame"

export function SourceFile({
  file,
}: {
  file: { path: string; source: string; lines: number; code: ReactNode }
}) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <DocFrame>
      <DocFrameBar>
        <Button
          variant="ghost"
          size="sm"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((value) => !value)}
          className="min-w-0 flex-1 justify-start"
        >
          <ChevronDown
            aria-hidden="true"
            className={open ? "rotate-180" : undefined}
          />
          <span
            className="min-w-0 truncate font-mono text-xs"
            title={file.path}
          >
            {file.path}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {file.lines} 行
          </span>
        </Button>
        <CopyButton value={file.source} label={`复制 ${file.path}`} />
      </DocFrameBar>
      <div id={id} hidden={!open} className="max-h-[44rem] overflow-auto">
        {open ? file.code : null}
      </div>
    </DocFrame>
  )
}
