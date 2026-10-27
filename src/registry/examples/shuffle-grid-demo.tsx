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

// 同一类别共用一个色调，格子点亮时图标换成类别色
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
  content: <Icon strokeWidth={1.6} className="size-6" />,
}))

// 十六枚图标轮流上墙，每一步只动一两个格子，同时有几枚亮起
export default function ShuffleGridDemo() {
  return (
    <ShuffleGrid
      label="十六个技术图标在方格里随机出现、换位并按类别点亮"
      rows={3}
      cols={4}
      items={SKILLS}
      activeCount={10}
      litCount={5}
      interval={1100}
      className="max-w-sm"
    />
  )
}
