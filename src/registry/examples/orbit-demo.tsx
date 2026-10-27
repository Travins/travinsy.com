import {
  Orbit,
  OrbitCenter,
  OrbitItem,
  OrbitRing,
} from "@/registry/ui/orbit/orbit"
import {
  Braces,
  Command,
  Database,
  Globe,
  Layers,
  Sparkles,
  Terminal,
} from "lucide-react"

// 图标节点：淡色底（和背景混合，不透出轨道线）+ 同色描边；胶囊节点只是把宽度放开
const NODE =
  "border-(--flow-tone)/35 bg-[color-mix(in_oklab,var(--flow-tone)_12%,var(--background))] shadow-sm max-sm:scale-75"
const PILL = `${NODE} h-8 w-auto px-2.5 text-[11px]`

export default function OrbitDemo() {
  return (
    <Orbit
      label="Next.js、Tailwind、TypeScript 等工具围绕个人站点标志运行的多层轨道"
      size={360}
      className="h-[22.5rem] max-sm:h-72"
    >
      {/* 上半弧：最外层只露出上半圈，边缘渐隐，制造纵深 */}
      <OrbitRing
        radius={166}
        arc="half"
        duration={70}
        startAngle={-140}
        dashed
        className="max-sm:hidden [&>[data-slot=orbit-path]]:border-(--flow-violet)/35"
      >
        <OrbitItem tone="violet" className={NODE}>
          <Sparkles />
        </OrbitItem>
        <OrbitItem tone="rose" angle={110} className={NODE}>
          <Braces />
        </OrbitItem>
      </OrbitRing>
      <OrbitRing
        radius={130}
        duration={56}
        startAngle={30}
        className="[&>[data-slot=orbit-path]]:border-(--flow-cyan)/35"
      >
        <OrbitItem tone="foreground" className={PILL}>
          Next.js
        </OrbitItem>
        <OrbitItem tone="cyan" angle={125} className={PILL}>
          Tailwind
        </OrbitItem>
        <OrbitItem tone="blue" angle={245} className={PILL}>
          TypeScript
        </OrbitItem>
      </OrbitRing>
      <OrbitRing
        radius={94}
        duration={40}
        reverse
        dashed
        startAngle={-120}
        className="[&>[data-slot=orbit-path]]:border-(--flow-amber)/40"
      >
        <OrbitItem tone="green" className={NODE}>
          <Database />
        </OrbitItem>
        <OrbitItem tone="amber" angle={120} className={NODE}>
          <Terminal />
        </OrbitItem>
        <OrbitItem tone="cyan" angle={240} className={NODE}>
          <Globe />
        </OrbitItem>
      </OrbitRing>
      <OrbitRing
        radius={56}
        duration={28}
        startAngle={20}
        className="[&>[data-slot=orbit-path]]:border-(--flow-blue)/45"
      >
        <OrbitItem tone="blue" className={NODE}>
          <Command />
        </OrbitItem>
        <OrbitItem tone="violet" angle={180} className={NODE}>
          <Layers />
        </OrbitItem>
      </OrbitRing>
      <OrbitCenter className="size-14 rounded-xl bg-primary text-primary-foreground shadow-md ring-8 ring-primary/10 max-sm:size-10 max-sm:ring-4">
        <span className="font-mono text-xl font-semibold">T.</span>
      </OrbitCenter>
    </Orbit>
  )
}
