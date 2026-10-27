import {
  IsometricMark,
  type IsometricShape,
} from "@/registry/ui/isometric-mark/isometric-mark"

// Pi 的像素标志：左边一块挖出方孔，右下一块独立的方块着主题色；孔壁同样按朝向自动消隐
const SHAPES: readonly IsometricShape[] = [
  {
    outer: [
      [0, 0],
      [360, 0],
      [360, 240],
      [240, 240],
      [240, 360],
      [120, 360],
      [120, 480],
      [0, 480],
    ],
    holes: [
      [
        [120, 120],
        [240, 120],
        [240, 240],
        [120, 240],
      ],
    ],
  },
  {
    outer: [
      [360, 240],
      [480, 240],
      [480, 480],
      [360, 480],
    ],
    tone: "var(--primary)",
  },
]

export default function IsometricMarkPiDemo() {
  return (
    <div className="relative isolate flex min-h-80 w-full items-center justify-center overflow-hidden px-6 py-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_45%_at_50%_58%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_75%)]"
      />
      <div className="w-full max-w-64">
        <IsometricMark
          shapes={SHAPES}
          rotation={-90}
          depth={60}
          guides
          floor="checker"
          material="cross"
          sound
          label="Pi"
        />
      </div>
    </div>
  )
}
