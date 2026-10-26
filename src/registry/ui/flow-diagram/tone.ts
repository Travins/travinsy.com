/** 点亮、光点、状态点可用的色调；只引用主题 token，跟随颜色主题变化。 */
type FlowTone = "primary" | "destructive"

// Tailwind 只识别完整的类名，所以每个色调都把类写全
const toneClasses = {
  primary: {
    lit: "fill-primary/10 stroke-primary",
    stroke: "stroke-primary",
    flow: "stroke-primary/40",
    fill: "fill-primary",
    text: "text-primary",
  },
  destructive: {
    lit: "fill-destructive/10 stroke-destructive",
    stroke: "stroke-destructive",
    flow: "stroke-destructive/40",
    fill: "fill-destructive",
    text: "text-destructive",
  },
} as const satisfies Record<FlowTone, Record<string, string>>

export { toneClasses }
export type { FlowTone }
