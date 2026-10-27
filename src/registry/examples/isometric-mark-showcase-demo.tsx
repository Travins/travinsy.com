import {
  IsometricMark,
  type IsometricShape,
} from "@/registry/ui/isometric-mark/isometric-mark"

// 本站标志「易」：上三道细斜杠是「日」，下三道粗斜杠是「勿」，右端齐平；坐标与站点 SVG 标志相同
const MARK_SHAPES: readonly IsometricShape[] = [
  // 上组：细斜杠
  {
    outer: [
      [156, 130],
      [416, 0],
      [416, 36],
      [156, 166],
    ],
  },
  {
    outer: [
      [156, 192],
      [416, 62],
      [416, 98],
      [156, 228],
    ],
  },
  {
    outer: [
      [156, 254],
      [416, 124],
      [416, 160],
      [156, 290],
    ],
  },
  // 下组：粗斜杠
  {
    outer: [
      [0, 394],
      [416, 186],
      [416, 258],
      [0, 466],
    ],
  },
  {
    outer: [
      [78, 453],
      [416, 284],
      [416, 356],
      [78, 525],
    ],
  },
  {
    outer: [
      [156, 512],
      [416, 382],
      [416, 454],
      [156, 584],
    ],
  },
]

// front 视角：标志像一块板向后倒下（默认 tilt 45°、turn -20°），斜杠与竖直切口的关系保持；
// 辅助线用 "edges"，贴着斜杠的长边与左右两端的切口
const DEPTH = 32

/** 列表封面：只留标志与底下的彩色光晕，铺满缩略图，不带标注标签。 */
export default function IsometricMarkShowcaseDemo() {
  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_64%,color-mix(in_oklab,var(--flow-blue)_18%,transparent),transparent_58%),radial-gradient(ellipse_at_88%_8%,color-mix(in_oklab,var(--flow-violet)_14%,transparent),transparent_46%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_75%)] opacity-70"
      />
      <div className="relative w-[min(88%,21rem)]">
        <IsometricMark
          shapes={MARK_SHAPES}
          view="front"
          depth={DEPTH}
          label="易"
          guides="edges"
        />
      </div>
    </div>
  )
}
