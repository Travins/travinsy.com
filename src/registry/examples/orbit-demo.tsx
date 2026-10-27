import {
  Orbit,
  OrbitCenter,
  OrbitItem,
  OrbitRing,
} from "@/registry/ui/orbit/orbit"
import {
  Box,
  Command,
  Layers,
  Sparkles,
  Triangle,
  Workflow,
} from "lucide-react"

export default function OrbitDemo() {
  return (
    <Orbit label="组件围绕中心标志运行的三层轨道">
      <OrbitRing radius={64} duration={22} startAngle={-35}>
        <OrbitItem>
          <Box />
        </OrbitItem>
        <OrbitItem angle={180}>
          <Layers />
        </OrbitItem>
      </OrbitRing>
      <OrbitRing radius={104} duration={34} reverse dashed startAngle={-110}>
        <OrbitItem>
          <Command />
        </OrbitItem>
        <OrbitItem angle={120}>
          <Triangle />
        </OrbitItem>
        <OrbitItem angle={240}>
          <Workflow />
        </OrbitItem>
      </OrbitRing>
      <OrbitRing radius={140} duration={48} startAngle={-50}>
        <OrbitItem tone="primary">
          <Sparkles />
        </OrbitItem>
      </OrbitRing>
      <OrbitCenter className="size-14 rounded-xl border border-edge bg-primary text-primary-foreground">
        <span className="font-mono text-2xl font-semibold">T.</span>
      </OrbitCenter>
    </Orbit>
  )
}
