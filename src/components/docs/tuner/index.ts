import { isometricMarkTuner } from "./isometric-mark"
import { orbitTuner } from "./orbit"
import { rippleTuner } from "./ripple"
import type { AnyTunerConfig } from "./types"

/**
 * 支持「调整面板」的组件，键是 registry 条目名（ComponentPreview 的 `item`）。
 * 接入新组件：组件侧导出覆盖 Context + onReport，在 `tuner/<name>.tsx` 声明控件，再在这里登记。
 */
export const tuners: Record<string, AnyTunerConfig | undefined> = {
  "isometric-mark": isometricMarkTuner,
  orbit: orbitTuner,
  ripple: rippleTuner,
}

export { TunerPanel, TunerProvider, TunerToggle } from "./panel"
export { useTuner } from "./use-tuner"
