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
import { controlKeys, type AnyTunerConfig } from "./types"
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

/**
 * 取某个示例实际可用的面板：组件没登记时返回 undefined；示例登记为 `false` 时也返回 undefined（不显示开关）；
 * 登记了 `omit` 时去掉对应控件。
 */
export function resolveTuner(
  item: string | undefined,
  example: string,
): AnyTunerConfig | undefined {
  const config = item ? tuners[item] : undefined
  const rule = config?.examples?.[example]
  if (!config || rule === false) return undefined
  if (!rule) return config
  return {
    ...config,
    controls: config.controls.filter(
      (control) =>
        !rule.omit.includes(control.key) &&
        !controlKeys(control).some((key) => rule.omit.includes(key)),
    ),
  }
}

export { TunerPanel, TunerProvider, TunerToggle } from "./panel"
export { useTuner } from "./use-tuner"
