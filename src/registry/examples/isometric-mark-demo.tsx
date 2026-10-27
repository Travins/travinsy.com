import { cn } from "@/lib/utils"
import {
  IsometricMark,
  type IsometricShape,
} from "@/registry/ui/isometric-mark/isometric-mark"

// 本站标志「易」：上三道细斜杠是「日」，下三道粗斜杠是「勿」，右端齐平；坐标与站点 SVG 标志相同
const LOGO: readonly (readonly [number, number])[][] = [
  // 上组：细斜杠
  [
    [156, 130],
    [416, 0],
    [416, 36],
    [156, 166],
  ],
  [
    [156, 192],
    [416, 62],
    [416, 98],
    [156, 228],
  ],
  [
    [156, 254],
    [416, 124],
    [416, 160],
    [156, 290],
  ],
  // 下组：粗斜杠
  [
    [0, 394],
    [416, 186],
    [416, 258],
    [0, 466],
  ],
  [
    [78, 453],
    [416, 284],
    [416, 356],
    [78, 525],
  ],
  [
    [156, 512],
    [416, 382],
    [416, 454],
    [156, 584],
  ],
]

// 朝向 -65°、标准等轴测俯仰 35°、挤出 52：斜杠立起往右上斜，细的一组在后、粗的一组在前；
// 辅助线用 "edges"，贴着斜杠的长边与齐平的切口
const MARK_SHAPES: readonly IsometricShape[] = LOGO.map((bar) => ({
  outer: [...bar],
}))

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
        <IsometricMark
          shapes={MARK_SHAPES}
          rotation={-65}
          elevation={35}
          depth={52}
          label="易"
          guides="edges"
        />
      </div>
      <Callout tone="blue" className="top-[18%] left-5">
        TOP · 斜纹顶面
      </Callout>
      <Callout tone="violet" className="bottom-[26%] left-5">
        WALL · 侧墙自动消隐
      </Callout>
      <Callout tone="amber" className="top-[24%] right-5">
        depth = 52
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
