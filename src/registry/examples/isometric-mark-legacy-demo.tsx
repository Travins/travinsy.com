import {
  IsometricMark,
  type IsometricShape,
} from "@/registry/ui/isometric-mark/isometric-mark"

// 旧版站点标志「易」：一圈外轮廓加 `>` 与 `_` 两个孔，演示带孔的形状
const MARK_SHAPES: readonly IsometricShape[] = [
  {
    outer: [
      [60, 0],
      [315, 0],
      [315, 281],
      [264, 332],
      [264, 232],
      [164, 332],
      [133, 301],
      [264, 170],
      [226, 170],
      [64, 332],
      [33, 301],
      [164, 170],
      [126, 170],
      [17, 279],
      [17, 217],
      [64, 170],
      [17, 170],
      [17, 43],
    ],
    holes: [
      [
        [85, 43],
        [123, 43],
        [163, 83],
        [123, 123],
        [85, 123],
        [125, 83],
      ],
      [
        [174, 101],
        [235, 101],
        [235, 123],
        [174, 123],
      ],
    ],
  },
]

/** 旧版标志：外轮廓带两个孔，挤出后孔壁同样按朝向消隐。 */
export default function IsometricMarkLegacyDemo() {
  return (
    <div className="relative flex min-h-80 w-full max-w-2xl items-center justify-center overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_64%,color-mix(in_oklab,var(--flow-blue)_18%,transparent),transparent_58%),radial-gradient(ellipse_at_88%_8%,color-mix(in_oklab,var(--flow-violet)_14%,transparent),transparent_46%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_75%)] opacity-70"
      />
      <div className="relative w-[min(78%,19rem)]">
        <IsometricMark shapes={MARK_SHAPES} rotation={-90} label="易" guides />
      </div>
    </div>
  )
}
