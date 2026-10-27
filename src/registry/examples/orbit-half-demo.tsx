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
      anchor="bottom"
      className="h-44"
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
        <OrbitItem>
          <Component />
        </OrbitItem>
        <OrbitItem angle={90}>
          <Palette />
        </OrbitItem>
        <OrbitItem angle={180}>
          <Sparkles />
        </OrbitItem>
        <OrbitItem angle={270}>
          <Blocks />
        </OrbitItem>
      </OrbitRing>
      <OrbitCenter className="-translate-y-[calc(100%+0.5rem)] rounded-lg border border-edge bg-background px-3 py-1.5 font-mono text-xs">
        registry
      </OrbitCenter>
    </Orbit>
  )
}
