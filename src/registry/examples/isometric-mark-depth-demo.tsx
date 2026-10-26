import {
  IsometricMark,
  type IsometricShape,
} from "@/registry/ui/isometric-mark/isometric-mark"

const SQUARE_SHAPES: readonly IsometricShape[] = [
  {
    outer: [
      [0, 0],
      [100, 0],
      [100, 100],
      [0, 100],
    ],
    holes: [
      [
        [35, 35],
        [65, 35],
        [65, 65],
        [35, 65],
      ],
    ],
  },
]

// 形状平面尺寸是 100，默认 depth 就是 12
const DEPTHS = [
  { depth: 4, note: "薄板" },
  { depth: 12, note: "默认" },
  { depth: 30, note: "厚块" },
] as const

export default function IsometricMarkDepthDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-3 gap-x-4">
      {DEPTHS.map(({ depth, note }) => (
        <figure key={depth} className="flex flex-col items-center gap-3">
          {/* 三块的高度不同，底对齐后下面的说明才排在同一行 */}
          <div className="flex w-full flex-1 items-end">
            <IsometricMark
              shapes={SQUARE_SHAPES}
              depth={depth}
              interactive={false}
              highlight={false}
              label={`挤出高度 ${depth}`}
            />
          </div>
          <figcaption className="text-center font-mono text-xs text-muted-foreground">
            depth={depth}
            <span className="mt-1 block font-sans text-muted-foreground/80">
              {note}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
