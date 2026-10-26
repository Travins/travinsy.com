import {
  IsometricMark,
  type IsometricShape,
} from "@/registry/ui/isometric-mark/isometric-mark"

// 不对称的 L 形，旋转后才看得出朝向
const L_SHAPES: readonly IsometricShape[] = [
  {
    outer: [
      [0, 0],
      [40, 0],
      [40, 60],
      [100, 60],
      [100, 100],
      [0, 100],
    ],
  },
]

const ROTATIONS = [0, 90, 180, -90] as const

export default function IsometricMarkRotationDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
      {ROTATIONS.map((rotation) => (
        <figure key={rotation} className="flex flex-col items-center gap-3">
          <div className="flex w-full flex-1 items-center">
            <IsometricMark
              shapes={L_SHAPES}
              rotation={rotation}
              interactive={false}
              highlight={false}
              label={`旋转 ${rotation} 度`}
            />
          </div>
          <figcaption className="font-mono text-xs text-muted-foreground">
            rotation={rotation}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
