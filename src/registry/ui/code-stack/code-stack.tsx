import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { flowToneStyle, type FlowTone } from "@/registry/ui/flow-diagram/tone"

const LANG_TONES: Record<string, FlowTone> = {
  ts: "blue",
  tsx: "cyan",
  js: "amber",
  json: "primary",
  css: "violet",
  md: "muted",
  py: "green",
  go: "cyan",
  rs: "rose",
  yaml: "amber",
}

type CodeStackSpread = "fan" | "cascade" | "grid"
type CodeStackProps = React.ComponentProps<"div"> & {
  /** 排列方式。@default "fan" */
  spread?: CodeStackSpread
  /** 悬停或内部控件聚焦时散开。@default true */
  hoverSpread?: boolean
  /** 最多显示的文件数，0 显示空堆叠。@default 8 */
  max?: number
}
type CodeFileLine = {
  indent?: number
  tokens: { width: number; tone?: FlowTone }[]
}
type CodeFileProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** 语言缩写，未知语言使用主题强调色。@default "ts" */
  lang?: string
  name?: string
  /** 每行的缩进与骨架片段，width 是相对于行宽的百分比。 */
  lines?: CodeFileLine[]
  /** 自动骨架的确定性种子。@default 1 */
  seed?: number
  active?: boolean
}

const codeStackVariants = cva(
  "relative isolate w-full [container-type:inline-size]",
  {
    variants: {
      spread: {
        fan: "h-80",
        cascade: "h-80",
        grid: "grid grid-cols-2 gap-4 p-4 sm:grid-cols-4",
      },
    },
    defaultVariants: { spread: "fan" },
  },
)

/** 纯 CSS 排列，不为装饰性悬停增加键盘焦点。 */
function CodeStack({
  className,
  children,
  spread = "fan",
  hoverSpread = true,
  max = 8,
  ...props
}: CodeStackProps) {
  const files = React.Children.toArray(children).slice(
    0,
    Math.max(0, Math.floor(max)),
  )
  return (
    <div
      data-slot="code-stack"
      data-spread={spread}
      data-hover-spread={hoverSpread || undefined}
      className={cn(codeStackVariants({ spread }), className)}
      {...props}
    >
      <style href="code-stack-layout" precedence="default">{`
        [data-slot="code-stack"] > [data-slot="code-stack-position"] { transition: transform 280ms cubic-bezier(.2,.8,.2,1); }
        [data-slot="code-stack"][data-spread="fan"] > [data-slot="code-stack-position"] {
          position: absolute; top: 50%; left: 50%; width: clamp(6.5rem, 25cqw, 10rem);
          transform: translate(calc(-50% + var(--code-offset) * min(7cqw, 2.5rem)), calc(-48% + var(--code-curve) * 4px)) rotate(calc(var(--code-offset) * 9deg));
        }
        [data-slot="code-stack"][data-spread="cascade"] > [data-slot="code-stack-position"] {
          position: absolute; top: 50%; left: 50%; width: clamp(7rem, 30cqw, 11rem);
          transform: translate(calc(-50% + var(--code-offset) * min(7cqw, 2.2rem)), calc(-50% + var(--code-offset) * 20px));
        }
        @media (hover: hover) and (prefers-reduced-motion: no-preference) {
          [data-slot="code-stack"][data-hover-spread][data-spread="fan"]:hover > [data-slot="code-stack-position"],
          [data-slot="code-stack"][data-hover-spread][data-spread="fan"]:focus-within > [data-slot="code-stack-position"] {
            transform: translate(calc(-50% + var(--code-offset) * min(9cqw, 3.2rem)), calc(-55% + var(--code-curve) * 5px)) rotate(calc(var(--code-offset) * 13deg));
          }
          [data-slot="code-stack"][data-hover-spread][data-spread="cascade"]:hover > [data-slot="code-stack-position"],
          [data-slot="code-stack"][data-hover-spread][data-spread="cascade"]:focus-within > [data-slot="code-stack-position"] {
            transform: translate(calc(-50% + var(--code-offset) * min(10cqw, 3rem)), calc(-50% + var(--code-offset) * 28px));
          }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-slot="code-stack"] > [data-slot="code-stack-position"] { transition: none; }
        }
      `}</style>
      {files.map((file, index) => {
        const offset = index - (files.length - 1) / 2
        return (
          <div
            key={React.isValidElement(file) ? (file.key ?? index) : index}
            data-slot="code-stack-position"
            className="relative min-w-0 has-data-active:z-20"
            style={
              {
                "--code-offset": offset,
                "--code-curve": offset * offset,
              } as React.CSSProperties
            }
          >
            {file}
          </div>
        )
      })}
    </div>
  )
}

function skeleton(seed: number): CodeFileLine[] {
  let value = seed >>> 0
  const random = () => {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0
    return value / 4294967296
  }
  return Array.from({ length: 8 }, (_, index) => ({
    indent: index === 0 || index === 7 ? 0 : 8,
    tokens: Array.from(
      { length: 2 + Math.floor(random() * 2) },
      (_, token) => ({
        width: 10 + Math.floor(random() * 16),
        tone: token === 0 ? "muted" : token === 1 ? undefined : "green",
      }),
    ),
  }))
}

/** 代码的示意卡片；骨架不是实际源码，文件名仍然能被读屏读取。 */
function CodeFile({
  className,
  lang = "ts",
  name,
  lines,
  seed = 1,
  active = false,
  style,
  ...props
}: CodeFileProps) {
  const language = lang.toLowerCase()
  const rows = lines ?? skeleton(seed)
  return (
    <div
      data-slot="code-file"
      data-active={active || undefined}
      className={cn(
        "relative flex aspect-[4/5] w-full min-w-0 flex-col overflow-hidden rounded-lg border border-edge bg-card text-card-foreground shadow-sm data-active:border-primary/60 data-active:ring-2 data-active:ring-primary/10",
        className,
      )}
      style={{ ...flowToneStyle(LANG_TONES[language] ?? "primary"), ...style }}
      {...props}
    >
      <div
        data-slot="code-file-header"
        className="flex min-w-0 flex-wrap items-center gap-1 border-b border-edge px-3 py-2.5"
      >
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 rounded-full bg-(--flow-rose)"
        />
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 rounded-full bg-(--flow-amber)"
        />
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 rounded-full bg-(--flow-green)"
        />
        <span
          className="mt-1 basis-full truncate font-mono text-[9px] text-muted-foreground"
          title={name}
        >
          {name ?? `file.${lang}`}
        </span>
      </div>
      <div
        data-slot="code-file-lines"
        aria-hidden="true"
        className="flex min-h-0 flex-1 flex-col justify-center gap-2 overflow-hidden px-3 py-3"
      >
        {rows.map((line, index) => (
          <div key={index} className="flex h-2 shrink-0 items-center gap-2">
            <span className="w-2 shrink-0 text-right font-mono text-[8px] text-muted-foreground">
              {index + 1}
            </span>
            <div
              className="flex min-w-0 flex-1 items-center gap-1"
              style={{
                paddingLeft: `${Math.max(0, Math.min(60, line.indent ?? 0))}%`,
              }}
            >
              {line.tokens.map((token, part) => (
                <span
                  key={part}
                  className="h-1 shrink-0 rounded-full bg-(--flow-tone)/45"
                  style={{
                    width: `${Math.max(0, Math.min(100, token.width))}%`,
                    ...(token.tone ? flowToneStyle(token.tone) : {}),
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div
        data-slot="code-file-footer"
        className="flex items-end justify-between gap-2 px-3 pb-3"
      >
        <span
          aria-hidden="true"
          className="font-mono text-[10px] text-muted-foreground/60"
        >
          {"</>"}
        </span>
        <span className="rounded-md border border-edge bg-(--flow-tone)/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-(--flow-tone)">
          {language.toUpperCase()}
        </span>
      </div>
    </div>
  )
}

export { CodeStack, CodeFile, codeStackVariants }
export type { CodeStackProps, CodeStackSpread, CodeFileProps, CodeFileLine }
