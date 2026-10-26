import {
  IsometricMark,
  type IsometricShape,
} from "@/registry/ui/isometric-mark/isometric-mark"

// 本站标志「易」：一圈外轮廓，加 `>` 与 `_` 两个孔
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

export default function IsometricMarkDemo() {
  return (
    <div className="w-full max-w-xs">
      <IsometricMark shapes={MARK_SHAPES} rotation={-90} label="易" guides />
    </div>
  )
}
