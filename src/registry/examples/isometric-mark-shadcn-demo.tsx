import {
  IsometricMark,
  type IsometricShape,
} from "@/registry/ui/isometric-mark/isometric-mark"

// shadcn/ui 的标志：两道互不相连的斜杠，各自着主题色的深浅，遮挡关系自动计算（圆头简化为方头）
const SHAPES: readonly IsometricShape[] = [
  // 长的一道
  {
    outer: [
      [403, 6],
      [432, 36],
      [36, 432],
      [6, 403],
    ],
    tone: "var(--primary)",
  },
  // 短的一道
  {
    outer: [
      [444, 236],
      [474, 265],
      [265, 474],
      [236, 444],
    ],
    tone: "color-mix(in oklab, var(--primary) 55%, var(--background))",
  },
]

export default function IsometricMarkShadcnDemo() {
  return (
    <div className="relative isolate flex min-h-80 w-full items-center justify-center overflow-hidden px-6 py-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_45%_at_50%_58%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_75%)]"
      />
      <div className="w-full max-w-64">
        <IsometricMark
          shapes={SHAPES}
          rotation={45}
          depth={56}
          guides="edges"
          floor="lines"
          material="lines"
          label="shadcn/ui"
        />
      </div>
    </div>
  )
}
