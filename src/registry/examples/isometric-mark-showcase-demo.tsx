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

/** 首页封面：与辅助线同平面的地面网格（floor）+ 主题色光晕 + 接触阴影，铺满格子，不带标注标签。 */
export default function IsometricMarkShowcaseDemo() {
  return (
    <div className="relative isolate flex size-full items-center justify-center overflow-hidden">
      {/* 主题色光晕：从标志下方向外晕开，颜色随主题变化 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_42%_at_50%_62%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_75%)]"
      />
      {/* 接触阴影：标志落在地面上的一团柔影 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[66%] left-1/2 -z-10 h-10 w-[46%] -translate-x-1/2 -rotate-[22deg] rounded-[50%] bg-foreground/10 blur-2xl dark:hidden"
      />
      <div className="relative w-[min(66%,16rem)]">
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
    </div>
  )
}
