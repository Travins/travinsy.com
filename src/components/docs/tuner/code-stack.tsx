import {
  CodeStackTuningContext,
  type CodeStackTuning,
  type CodeStackReport,
} from "@/registry/ui/code-stack/code-stack"
import { defineTuner } from "./types"

export const codeStackTuner = defineTuner<CodeStackTuning, CodeStackReport>({
  hint: "实时调整示例参数",
  component: "CodeStack",
  context: CodeStackTuningContext,
  frame: { stableFrame: true },
  controls: [
    {
      key: "spread",
      type: "segmented",
      label: "排列 spread",
      options: [
        { value: "fan", label: "扇形" },
        { value: "cascade", label: "层叠" },
        { value: "grid", label: "网格" },
      ],
    },
    { key: "max", type: "slider", label: "显示上限 max", min: 1, max: 8 },
    { key: "hoverSpread", type: "switch", label: "悬停散开 hoverSpread" },
    { key: "active", type: "switch", label: "激活高亮 active" },
  ],
  defaults: { spread: "fan", max: 8, hoverSpread: true, active: true },
  fromReport: (report) => ({ ...report }),
  toTuning: (values) => ({
    spread: values.spread as CodeStackTuning["spread"],
    max: values.max as CodeStackTuning["max"],
    hoverSpread: values.hoverSpread as CodeStackTuning["hoverSpread"],
    active: values.active as CodeStackTuning["active"],
  }),
})
