import {
  Orbit,
  OrbitCenter,
  OrbitItem,
  OrbitRing,
} from "@/registry/ui/orbit/orbit"
import {
  Blocks,
  Braces,
  Component,
  Layers,
  Palette,
  Sparkles,
  Terminal,
} from "lucide-react"

export default function OrbitHalfDemo() {
  return (
    <Orbit
      label="上半圆轨道，节点在地平线处淡出"
      background="dots"
      className="h-64 [&_[data-slot=orbit-canvas]]:translate-y-24"
    >
      <OrbitRing radius={80} arc="half" duration={20} startAngle={-120}>
        <OrbitItem>
          <Braces />
        </OrbitItem>
        <OrbitItem angle={120}>
          <Terminal />
        </OrbitItem>
        <OrbitItem angle={240}>
          <Layers />
        </OrbitItem>
      </OrbitRing>
      <OrbitRing
        radius={140}
        arc="half"
        dashed
        reverse
        duration={32}
        startAngle={-60}
      >
        <OrbitItem tone="blue">
          <Component />
        </OrbitItem>
        <OrbitItem angle={90} tone="violet">
          <Palette />
        </OrbitItem>
        <OrbitItem angle={180} tone="amber">
          <Sparkles />
        </OrbitItem>
        <OrbitItem angle={270} tone="green">
          <Blocks />
        </OrbitItem>
      </OrbitRing>
      <OrbitCenter className="-translate-y-6 rounded-lg border border-edge bg-background px-3 py-1.5 font-mono text-xs text-foreground">
        registry
      </OrbitCenter>
    </Orbit>
  )
}
