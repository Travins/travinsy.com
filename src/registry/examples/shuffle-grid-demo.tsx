import {
  Bot,
  Braces,
  Cloud,
  Database,
  GitBranch,
  Globe,
  Layers,
  Palette,
  Rocket,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  Terminal,
  Workflow,
  Zap,
} from "lucide-react"

import {
  ShuffleGrid,
  type ShuffleGridItem,
} from "@/registry/ui/shuffle-grid/shuffle-grid"

// 色调对应技能类别，格子点亮时图标换成类别色，下方图例与之对应
const LEGEND = [
  { tone: "blue", label: "前端" },
  { tone: "green", label: "后端" },
  { tone: "cyan", label: "基础设施" },
  { tone: "violet", label: "AI" },
  { tone: "amber", label: "工程" },
] as const

const POOL = [
  { Icon: Braces, tone: "blue" },
  { Icon: Palette, tone: "blue" },
  { Icon: Smartphone, tone: "blue" },
  { Icon: Layers, tone: "blue" },
  { Icon: Database, tone: "green" },
  { Icon: Server, tone: "green" },
  { Icon: Cloud, tone: "cyan" },
  { Icon: Globe, tone: "cyan" },
  { Icon: Shield, tone: "cyan" },
  { Icon: Sparkles, tone: "violet" },
  { Icon: Bot, tone: "violet" },
  { Icon: Workflow, tone: "violet" },
  { Icon: GitBranch, tone: "amber" },
  { Icon: Terminal, tone: "amber" },
  { Icon: Rocket, tone: "amber" },
  { Icon: Zap, tone: "amber" },
] as const

const SKILLS: ShuffleGridItem[] = POOL.map(({ Icon, tone }, index) => ({
  id: `skill-${index}`,
  tone,
  content: <Icon strokeWidth={1.6} className="size-4" />,
}))

// 技术栈墙：十六枚图标轮流上墙，每一步只动一两个格子，同时有几枚按类别色亮起
export default function ShuffleGridDemo() {
  return (
    <div className="relative flex w-full items-center justify-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 bg-dots [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_72%)] opacity-70"
      />
      <div className="relative flex w-full max-w-[17rem] flex-col gap-3 rounded-lg border border-edge bg-card p-3.5 shadow-xs">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-xs font-medium">技术栈</p>
          <p className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-(--flow-green) motion-safe:animate-pulse"
            />
            16 项 · 随机点亮
          </p>
        </div>
        <ShuffleGrid
          label="十六个技术图标在方格里随机出现、换位并按类别点亮"
          rows={3}
          cols={4}
          items={SKILLS}
          activeCount={10}
          litCount={5}
          interval={1100}
        />
        <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          {LEGEND.map(({ tone, label }) => (
            <li key={tone} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full"
                style={{ backgroundColor: `var(--flow-${tone})` }}
              />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
