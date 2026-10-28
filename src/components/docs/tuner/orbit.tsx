import {
  OrbitTuningContext,
  type OrbitReport,
  type OrbitTuning,
} from "@/registry/ui/orbit/orbit"
import { toneOptions } from "./swatches"
import { defineTuner } from "./types"

/**
 * 轨道环绕的调整面板：全局覆盖，作用于 `Orbit` 子树里的每一条轨道。
 * 画框与外框高度不随参数变化，打开面板时容器大小不变。
 */

const own = { value: "own", label: "原样" }

export const orbitTuner = defineTuner<OrbitTuning, OrbitReport>({
  hint: "调整速度、方向与轨道线",
  component: "Orbit",
  context: OrbitTuningContext,
  controls: [
    {
      key: "speed",
      type: "slider",
      label: "速度 duration",
      unit: "×",
      min: 0.25,
      max: 4,
      step: 0.05,
    },
    {
      key: "dashed",
      type: "segmented",
      label: "轨道线 dashed",
      options: [
        own,
        { value: "solid", label: "实线" },
        { value: "dashed", label: "虚线" },
      ],
    },
    {
      key: "background",
      type: "segmented",
      label: "底纹 background",
      options: [
        { value: "dots", label: "点阵" },
        { value: "grid", label: "方格" },
        { value: "lines", label: "横线" },
        { value: "hatch", label: "斜纹" },
        { value: "none", label: "无" },
      ],
    },
    {
      key: "tone",
      type: "tone",
      label: "轨道色调 tone",
      options: toneOptions(own),
    },
    { key: "reverse", type: "switch", label: "整体反向 reverse" },
    { key: "paused", type: "switch", label: "暂停 paused" },
  ],
  defaults: {
    speed: 1,
    dashed: "own",
    tone: "own",
    reverse: false,
    paused: false,
  },
  // 速度、方向、轨道线与色调是对每条轨道的整体覆盖，示例自己的取值就是「原样」
  fromReport: (report) => ({
    paused: report.paused,
    background: report.background,
    speed: 1,
    reverse: false,
    dashed: "own",
    tone: "own",
  }),
  toTuning: (values) => ({
    speed: values.speed as number | undefined,
    flip: values.reverse as boolean | undefined,
    paused: values.paused as boolean | undefined,
    background: values.background as OrbitTuning["background"],
    dashed:
      values.dashed === undefined || values.dashed === "own"
        ? undefined
        : values.dashed === "dashed",
    tone:
      values.tone === undefined || values.tone === "own"
        ? undefined
        : values.tone === "theme"
          ? false
          : (values.tone as string),
  }),
})
