import {
  Orbit,
  OrbitCenter,
  OrbitItem,
  OrbitRing,
} from "@/registry/ui/orbit/orbit"
import {
  Braces,
  Code,
  Database,
  Globe,
  Layers,
  Terminal,
  Zap,
} from "lucide-react"

export default function OrbitIconsDemo() {
  return (
    <Orbit label="代码节点连接数据库、终端与网络" background="grid">
      <OrbitRing radius={74} duration={26} startAngle={-90}>
        <OrbitItem tone="blue">
          <Database />
        </OrbitItem>
        <OrbitItem tone="green" angle={120}>
          <Terminal />
        </OrbitItem>
        <OrbitItem tone="amber" angle={240}>
          <Zap />
        </OrbitItem>
      </OrbitRing>
      <OrbitRing radius={126} reverse duration={38} dashed startAngle={-30}>
        <OrbitItem tone="violet">
          <Layers />
        </OrbitItem>
        <OrbitItem tone="cyan" angle={120}>
          <Globe />
        </OrbitItem>
        <OrbitItem tone="rose" angle={240}>
          <Braces />
        </OrbitItem>
      </OrbitRing>
      <OrbitCenter className="size-16 rounded-xl border border-edge bg-background text-primary">
        <Code className="size-7" />
      </OrbitCenter>
    </Orbit>
  )
}
