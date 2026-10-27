import {
  IsometricMark,
  type IsometricShape,
} from "@/registry/ui/isometric-mark/isometric-mark"

// Vercel 的三角标：最简单的单个多边形，素面 + 包围盒辅助线；关掉指针高光，画面更安静
const SHAPES: readonly IsometricShape[] = [
  {
    outer: [
      [240, 32],
      [480, 448],
      [0, 448],
    ],
  },
]

export default function IsometricMarkVercelDemo() {
  return (
    <div className="relative isolate flex min-h-80 w-full items-center justify-center overflow-hidden px-6 py-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_45%_at_50%_58%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_75%)]"
      />
      <div className="w-full max-w-64">
        <IsometricMark
          shapes={SHAPES}
          rotation={0}
          depth={110}
          guides
          floor="dots"
          material="plain"
          highlight={false}
          sound
          label="Vercel"
        />
      </div>
    </div>
  )
}
