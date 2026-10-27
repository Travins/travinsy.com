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
// 辅助线用 "edges"，贴着斜杠的长边与齐平的切口；斜杠本身向右上斜，顶面用横纹，与斜杠长边错开不产生视差
// 上三道细斜杠用主题色由浅到深（从后往前），下三道粗斜杠保持单色线稿，主次分明
const TONES = [
  "color-mix(in oklab, var(--primary) 55%, var(--background))",
  "color-mix(in oklab, var(--primary) 78%, var(--background))",
  "var(--primary)",
]
const MARK_SHAPES: readonly IsometricShape[] = LOGO.map((bar, index) => ({
  outer: [...bar],
  tone: TONES[index],
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

// 地面网格（floor）与辅助线同一平面、对齐标志的每条边；主题色光晕与接触阴影让标志落在地面上，标注标签讲清几何怎么来
export default function IsometricMarkDemo() {
  return (
    <div className="relative isolate flex min-h-72 w-full max-w-2xl items-center justify-center overflow-hidden rounded-lg border border-edge bg-card px-4 pt-6 pb-12 sm:min-h-96">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_42%_at_50%_58%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_75%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[62%] left-1/2 -z-10 h-10 w-[34%] -translate-x-1/2 -rotate-[22deg] rounded-[50%] bg-foreground/10 blur-2xl"
      />
      <div className="relative w-full max-w-[17rem] sm:max-w-80">
        <IsometricMark
          shapes={MARK_SHAPES}
          rotation={-65}
          elevation={35}
          depth={52}
          material="lines"
          label="易"
          guides="edges"
          floor
        />
      </div>
      <Callout tone="blue" className="top-[18%] left-5">
        TOP · 横纹顶面
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
