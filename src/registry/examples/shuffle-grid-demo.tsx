import {
  Bot,
  Boxes,
  Braces,
  Cloud,
  Code,
  Cpu,
  Database,
  GitBranch,
  Globe,
  Layers,
  Package,
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

const ICONS = [
  Braces,
  Database,
  Globe,
  Cloud,
  Cpu,
  Code,
  Terminal,
  Layers,
  Palette,
  Rocket,
  Shield,
  Zap,
  GitBranch,
  Package,
  Server,
  Smartphone,
  Sparkles,
  Workflow,
  Bot,
  Boxes,
]
const TONES = ["blue", "violet", "cyan", "green", "amber", "rose"] as const

const SKILLS: ShuffleGridItem[] = ICONS.map((Icon, index) => ({
  id: `skill-${index}`,
  tone: TONES[index % TONES.length],
  content: <Icon strokeWidth={1.6} className="size-6" />,
}))

// 能力墙：二十枚图标轮流上墙，每一步只动一两个格子，同时有几枚亮起彩色
export default function ShuffleGridDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-4 rounded-lg border border-edge bg-card p-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium">能力墙</p>
        <p className="font-mono text-xs text-muted-foreground">
          20 项技能 · 随机点亮
        </p>
      </div>
      <ShuffleGrid
        label="二十个技术图标在方格里随机出现、换位并点亮"
        rows={4}
        cols={6}
        items={SKILLS}
        activeCount={15}
        litCount={6}
        interval={1100}
      />
    </div>
  )
}
