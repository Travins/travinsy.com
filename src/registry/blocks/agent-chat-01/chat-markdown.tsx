import type { ReactNode } from "react"

// 仅解析段落、列表和行内代码；React 自动转义文本，不解释 HTML。
function inline(text: string): ReactNode {
  return text.split(/(`[^`]+`)/g).map((part, index) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code
        key={index}
        className="rounded bg-muted px-1 py-0.5 font-mono text-xs"
      >
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  )
}
function AgentChatMarkdown({ text }: { text: string }) {
  return (
    <div
      data-slot="agent-chat-markdown"
      className="flex flex-col gap-3 leading-7"
    >
      {text.split(/\n\n+/).map((paragraph, index) => {
        const lines = paragraph.split("\n")
        if (lines.every((line) => /^[-*] /.test(line)))
          return (
            <ul key={index} className="flex list-disc flex-col gap-1 pl-5">
              {lines.map((line, i) => (
                <li key={i}>{inline(line.slice(2))}</li>
              ))}
            </ul>
          )
        if (lines.every((line) => /^\d+\. /.test(line)))
          return (
            <ol key={index} className="flex list-decimal flex-col gap-1 pl-5">
              {lines.map((line, i) => (
                <li key={i}>{inline(line.replace(/^\d+\. /, ""))}</li>
              ))}
            </ol>
          )
        return (
          <p key={index} className="whitespace-pre-wrap">
            {inline(paragraph)}
          </p>
        )
      })}
    </div>
  )
}

export { AgentChatMarkdown }
