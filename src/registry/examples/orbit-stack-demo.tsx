import {
  Orbit,
  OrbitCenter,
  OrbitItem,
  OrbitRing,
} from "@/registry/ui/orbit/orbit"

// 文字节点：`w-auto px-3` 把方块撑成胶囊
const PILL = "w-auto px-3 text-xs"

export default function OrbitStackDemo() {
  return (
    <Orbit
      label="技术栈：React、Next.js、TypeScript、Tailwind"
      background="none"
      className="h-80"
    >
      <OrbitRing radius={96} duration={36} dashed>
        <OrbitItem className={PILL}>React</OrbitItem>
        <OrbitItem angle={90} className={PILL}>
          Next.js
        </OrbitItem>
        <OrbitItem angle={180} className={PILL}>
          TypeScript
        </OrbitItem>
        <OrbitItem angle={270} className={PILL}>
          Tailwind
        </OrbitItem>
      </OrbitRing>
      <OrbitCenter className="rounded-lg border border-edge bg-background px-3 py-1.5 text-xs text-muted-foreground">
        工具箱
      </OrbitCenter>
    </Orbit>
  )
}
