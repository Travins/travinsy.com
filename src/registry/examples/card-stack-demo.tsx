import type { ReactNode } from "react"
import { ArrowUpRight } from "lucide-react"
import {
  CardStack,
  CardStackControls,
  CardStackItem,
} from "@/registry/ui/card-stack/card-stack"
import {
  flowToneStyle,
  type FlowToneName,
} from "@/registry/lib/flow-tone"

// 每张卡有自己的色调与封面图形；卡片底部一条同色细带，叠在后面时露出来，层次一眼可见
const LINES =
  "bg-[linear-gradient(to_right,var(--flow-tone)_1px,transparent_1px),linear-gradient(to_bottom,var(--flow-tone)_1px,transparent_1px)] bg-[size:14px_14px] opacity-[0.16]"

function Blocks() {
  return (
    <div className="relative size-16" aria-hidden="true">
      <span className="absolute bottom-0 left-0 size-9 rounded-md border border-(--flow-tone)/40 bg-(--flow-tone)/15" />
      <span className="absolute right-0 bottom-0 size-9 rounded-md border border-(--flow-tone)/40 bg-(--flow-tone)/30" />
      <span className="absolute top-0 left-3.5 size-9 rounded-md border border-(--flow-tone) bg-(--flow-tone)" />
    </div>
  )
}

function TextLines() {
  return (
    <div className="flex w-24 flex-col gap-2" aria-hidden="true">
      <span className="h-1.5 w-full rounded-full bg-(--flow-tone)" />
      <span className="h-1.5 w-4/5 rounded-full bg-(--flow-tone)/45" />
      <span className="h-1.5 w-full rounded-full bg-(--flow-tone)/45" />
      <span className="h-1.5 w-3/5 rounded-full bg-(--flow-tone)/25" />
    </div>
  )
}

function Bars() {
  return (
    <div className="flex h-14 items-end gap-1.5" aria-hidden="true">
      {[40, 65, 50, 85, 60, 100].map((height, index) => (
        <span
          key={index}
          className="w-3 rounded-t-[3px] bg-(--flow-tone)"
          style={{ height: `${height}%`, opacity: index === 5 ? 1 : 0.4 }}
        />
      ))}
    </div>
  )
}

function Sparkline() {
  return (
    <svg
      viewBox="0 0 96 48"
      className="h-14 w-28 text-(--flow-tone)"
      aria-hidden="true"
    >
      <path
        d="M2 38 C14 36 18 20 30 24 S46 40 58 22 S78 6 94 10 L94 48 L2 48 Z"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path
        d="M2 38 C14 36 18 20 30 24 S46 40 58 22 S78 6 94 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="94" cy="10" r="3.5" fill="currentColor" />
    </svg>
  )
}

const projects: {
  tone: FlowToneName
  name: string
  title: string
  description: string
  tags: string[]
  art: ReactNode
}[] = [
  {
    tone: "blue",
    name: "个人组件库",
    title: "把界面，写成积木",
    description: "从重复的界面里，提炼可以自由组合的原语。",
    tags: ["React", "Tailwind"],
    art: <Blocks />,
  },
  {
    tone: "violet",
    name: "开发者笔记",
    title: "让想法有处安放",
    description: "记录解决问题的过程，也留下新的疑问。",
    tags: ["Next.js", "MDX"],
    art: <TextLines />,
  },
  {
    tone: "amber",
    name: "构建面板",
    title: "把耗时，看得见",
    description: "每次构建的体积与耗时，一眼看出变化。",
    tags: ["TypeScript", "图表"],
    art: <Bars />,
  },
  {
    tone: "green",
    name: "站点数据",
    title: "访客，慢慢变多",
    description: "只在构建时取数，静态导出也有实时感。",
    tags: ["静态导出", "OSS"],
    art: <Sparkline />,
  },
]

export default function CardStackDemo() {
  return (
    <div className="w-full max-w-xs">
      <CardStack
        mode="drag"
        label="精选项目"
        offset={14}
        scale={0.05}
        depth={3}
      >
        {projects.map((project) => (
          <CardStackItem
            key={project.name}
            className="flex flex-col overflow-hidden p-0 shadow-sm"
            style={flowToneStyle(project.tone)}
          >
            <div className="relative flex h-24 items-center justify-center border-b border-edge bg-(--flow-tone)/8">
              <div aria-hidden="true" className={`absolute inset-0 ${LINES}`} />
              <div className="relative mt-3">{project.art}</div>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <p className="mb-1 text-xs text-muted-foreground">
                {project.name}
              </p>
              <h3 className="text-lg font-medium tracking-tight">
                {project.title}
              </h3>
              <p className="mt-2 text-[13px] leading-5 text-muted-foreground">
                {project.description}
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-edge bg-background px-2 py-0.5 font-mono text-[11px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <ArrowUpRight
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div aria-hidden="true" className="h-1.5 bg-(--flow-tone)" />
          </CardStackItem>
        ))}
        <CardStackControls className="mt-3" />
      </CardStack>
      <p className="mt-1 text-center font-mono text-[11px] text-muted-foreground">
        ← 拖动卡片切换 →
      </p>
    </div>
  )
}
