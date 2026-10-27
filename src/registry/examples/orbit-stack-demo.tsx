import {
  Orbit,
  OrbitCenter,
  OrbitItem,
  OrbitRing,
} from "@/registry/ui/orbit/orbit"

export default function OrbitStackDemo() {
  return (
    <Orbit
      label="技术栈：Next.js、React、Tailwind、TypeScript"
      background="none"
    >
      <OrbitRing radius={78} duration={32} startAngle={-90}>
        <OrbitItem className="w-auto px-2 text-[10px]">React</OrbitItem>
        <OrbitItem angle={180} className="w-auto px-2 text-[10px]">
          Next.js
        </OrbitItem>
      </OrbitRing>
      <OrbitRing radius={112} duration={44} reverse dashed startAngle={0}>
        <OrbitItem className="w-auto px-2 text-[10px]" tone="primary">
          TypeScript
        </OrbitItem>
        <OrbitItem angle={180} className="w-auto px-2 text-[10px]">
          Tailwind
        </OrbitItem>
      </OrbitRing>
      <OrbitCenter className="rounded-lg border border-edge bg-background px-3 py-2 text-xs text-muted-foreground">
        构建工具箱
      </OrbitCenter>
    </Orbit>
  )
}
