import {
  IsometricMark,
  type IsometricShape,
} from "@/registry/ui/isometric-mark/isometric-mark"

// 带方孔的正方形，开启背景辅助线
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

export default function IsometricMarkSimpleDemo() {
  return (
    <div className="w-full max-w-xs">
      <IsometricMark shapes={SQUARE_SHAPES} guides label="带方孔的方块" />
    </div>
  )
}
