/** 外框内置的底纹：`dots` 点阵、`grid` 方格、`lines` 横线、`hatch` 斜纹、`none` 不要底纹。 */
type FlowBackgroundName = "dots" | "grid" | "lines" | "hatch" | "none"

// 点阵与斜纹来自 grid-layout 提供的 bg-dots / bg-hatch；方格与横线直接用 --edge 画渐变，
// 所以只依赖 grid-layout 带来的 --edge 变量，不需要额外的工具类
const backgroundClasses = {
  dots: "bg-dots",
  grid: "bg-[linear-gradient(to_right,var(--edge)_1px,transparent_1px),linear-gradient(to_bottom,var(--edge)_1px,transparent_1px)] bg-[size:16px_16px]",
  lines:
    "bg-[linear-gradient(to_bottom,var(--edge)_1px,transparent_1px)] bg-[size:100%_12px]",
  hatch: "bg-hatch",
  none: "",
} as const satisfies Record<FlowBackgroundName, string>

/** 向四周淡出的遮罩，让图示像摆在图纸上 */
const FADE_MASK =
  "[mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]"

export { FADE_MASK, backgroundClasses }
export type { FlowBackgroundName }
