import { cn } from "@/lib/utils"
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

// 标注标签：圆点取自 --flow-* 色调，说明这块几何由哪个部分生成
function Callout({
  tone,
  className,
  children,
}: {
  tone: "blue" | "violet" | "amber" | "green"
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "absolute hidden items-center gap-1.5 rounded-md border border-edge bg-background/90 px-2 py-1 font-mono text-[10px] text-muted-foreground shadow-xs backdrop-blur-sm sm:flex",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full"
        style={{ backgroundColor: `var(--flow-${tone})` }}
      />
      {children}
    </span>
  )
}

// 线条本身只用前景色，所以靠底下的彩色光晕、点阵与标注标签把「几何是算出来的」讲清楚
export default function IsometricMarkDemo() {
  return (
    <div className="relative flex min-h-72 w-full max-w-2xl items-center justify-center overflow-hidden rounded-lg border border-edge bg-card px-4 pt-6 pb-12 sm:min-h-96">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_64%,color-mix(in_oklab,var(--flow-blue)_18%,transparent),transparent_58%),radial-gradient(ellipse_at_88%_8%,color-mix(in_oklab,var(--flow-violet)_14%,transparent),transparent_46%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_75%)] opacity-70"
      />
      <div className="relative w-full max-w-[17rem] sm:max-w-80">
        <IsometricMark shapes={MARK_SHAPES} rotation={-90} label="易" guides />
      </div>
      <Callout tone="blue" className="top-[18%] left-5">
        TOP · 斜纹顶面
      </Callout>
      <Callout tone="violet" className="bottom-[26%] left-5">
        WALL · 侧墙自动消隐
      </Callout>
      <Callout tone="amber" className="top-[24%] right-5">
        depth = 12
      </Callout>
      <Callout tone="green" className="right-5 bottom-[26%]">
        SVG · 可用 className 缩放
      </Callout>
      <p className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 font-mono text-[10px] tracking-widest text-muted-foreground">
        <span aria-hidden="true" className="size-1 bg-primary" />
        移动指针看高光 · 按住压下
      </p>
    </div>
  )
}
