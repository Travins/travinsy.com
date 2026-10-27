import { cardStackTuner } from "./card-stack"
import { codeStackTuner } from "./code-stack"
import { flowDiagramTuner } from "./flow-diagram"
import { globeTuner } from "./globe"
import { glyphFieldTuner } from "./glyph-field"
import { isometricMarkTuner } from "./isometric-mark"
import { marqueeTuner } from "./marquee"
import { orbitTuner } from "./orbit"
import { rippleTuner } from "./ripple"
import { shuffleGridTuner } from "./shuffle-grid"
import { textAnimateTuner } from "./text-animate"
import type { AnyTunerConfig } from "./types"
import { valueSliderTuner } from "./value-slider"

/**
 * 支持「调整面板」的组件，键是 registry 条目名（ComponentPreview 的 `item`）。
 * 接入新组件：组件侧导出覆盖 Context + onReport，在 `tuner/<name>.tsx` 声明控件，再在这里登记。
 */
export const tuners: Record<string, AnyTunerConfig | undefined> = {
  "isometric-mark": isometricMarkTuner,
  orbit: orbitTuner,
  ripple: rippleTuner,
  globe: globeTuner,
  "glyph-field": glyphFieldTuner,
  "shuffle-grid": shuffleGridTuner,
  "flow-diagram": flowDiagramTuner,
  marquee: marqueeTuner,
  "text-animate": textAnimateTuner,
  "card-stack": cardStackTuner,
  "code-stack": codeStackTuner,
  "value-slider": valueSliderTuner,
}

export { TunerPanel, TunerProvider, TunerToggle } from "./panel"
export { useTuner } from "./use-tuner"
