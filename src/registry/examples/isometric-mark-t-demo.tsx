import {
  IsometricMark,
  type IsometricShape,
} from "@/registry/ui/isometric-mark/isometric-mark"

// 本站上一版标志：倾斜横梁 + 竖笔组成的 T，两块独立的多边形
const T_SHAPES: readonly IsometricShape[] = [
  {
    outer: [
      [400, 289],
      [1044, 413],
      [627, 553],
      [210, 390],
    ],
  },
  {
    outer: [
      [476, 524],
      [627, 583],
      [778, 532],
      [778, 872],
      [476, 975],
    ],
  },
]

export default function IsometricMarkTDemo() {
  return (
    <div className="w-full max-w-xs">
      <IsometricMark shapes={T_SHAPES} rotation={-90} label="T" guides />
    </div>
  )
}
