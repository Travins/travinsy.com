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

export default function IsometricMarkInteractionDemo() {
  return (
    <div className="grid w-full max-w-lg grid-cols-2 gap-x-6">
      <figure className="flex flex-col items-center gap-3">
        <IsometricMark shapes={SQUARE_SHAPES} label="可交互的方块" />
        <figcaption className="text-center text-sm text-muted-foreground">
          默认
          <span className="mt-1 block text-xs">悬停出高光，按住压下</span>
        </figcaption>
      </figure>
      <figure className="flex flex-col items-center gap-3">
        <IsometricMark
          shapes={SQUARE_SHAPES}
          interactive={false}
          highlight={false}
          label="静态的方块"
        />
        <figcaption className="text-center text-sm text-muted-foreground">
          静态
          <span className="mt-1 block text-xs">
            关闭 interactive 与 highlight
          </span>
        </figcaption>
      </figure>
    </div>
  )
}
