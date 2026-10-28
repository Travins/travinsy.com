import {
  IsometricMarkTuningContext,
  type IsometricMarkReport,
  type IsometricMarkTuning,
  type IsometricMaterial,
} from "@/registry/ui/isometric-mark/isometric-mark"
import { defineTuner } from "./types"
import { MaterialSwatch } from "./material-swatch"

/**
 * 等轴测标志的调整面板：朝向、俯仰、挤出高度、顶面材质、地面、辅助线、音色与四个开关。
 * 打开时启用固定画框（stableFrame）：沿用示例原来的画框，调整中容器大小与图形比例都不变。
 */

const FLOORS = [
  { value: "grid", label: "方格" },
  { value: "lines", label: "条纹" },
  { value: "dots", label: "格点" },
  { value: "checker", label: "棋盘" },
  { value: "off", label: "无" },
]

const MATERIALS: { value: IsometricMaterial; label: string }[] = [
  { value: "hatch", label: "斜纹" },
  { value: "hatch-reverse", label: "反斜纹" },
  { value: "cross", label: "网纹" },
  { value: "dots", label: "点阵" },
  { value: "lines", label: "横纹" },
  { value: "plain", label: "素面" },
]

const GUIDES = [
  { value: "edges", label: "沿边" },
  { value: "box", label: "包围盒" },
  { value: "off", label: "关闭" },
]

/** 面板用 "off" 表示关闭，组件的属性是 false */
const offToFalse = <T,>(value: T | undefined) =>
  value === undefined ? undefined : value === "off" ? false : value

export const isometricMarkTuner = defineTuner<
  IsometricMarkTuning,
  IsometricMarkReport
>({
  hint: "调整角度、高度与材质",
  component: "IsometricMark",
  context: IsometricMarkTuningContext,
  frame: { stableFrame: true },
  controls: [
    // 朝向与俯仰一起决定视角，放在一块二维板上一次拖好：左右转朝向，上下调俯仰
    {
      key: "view",
      type: "xy",
      label: "视角",
      rowSpan: 3,
      x: {
        key: "rotation",
        label: "朝向 rotation",
        unit: "°",
        min: -180,
        max: 180,
      },
      y: {
        key: "elevation",
        label: "俯仰 elevation",
        unit: "°",
        min: 5,
        max: 85,
      },
    },
    { key: "depth", type: "slider", label: "挤出高度 depth", min: 0, max: 160 },
    {
      key: "soundTone",
      type: "slider",
      label: "音色 闷 → 脆",
      min: 0,
      max: 100,
    },
    {
      key: "material",
      type: "segmented",
      label: "材质 material",
      span: 2,
      options: MATERIALS.map((option) => ({
        ...option,
        swatch: <MaterialSwatch material={option.value} />,
      })),
    },
    {
      key: "guides",
      type: "segmented",
      label: "辅助线 guides",
      span: 2,
      options: GUIDES,
    },
    {
      key: "floor",
      type: "segmented",
      label: "地面 floor",
      span: 2,
      options: FLOORS,
    },
    { key: "interactive", type: "switch", label: "点击按下 interactive" },
    { key: "highlight", type: "switch", label: "指针高光 highlight" },
    { key: "sound", type: "switch", label: "点击音效 sound" },
  ],
  defaults: {
    rotation: 0,
    elevation: 35.26,
    depth: 40,
    interactive: true,
    highlight: true,
    sound: false,
    soundTone: 60,
  },
  fromReport: (report) => ({
    rotation: report.rotation,
    elevation: report.elevation,
    depth: report.depth,
    material: report.material,
    interactive: report.interactive,
    highlight: report.highlight,
    sound: report.sound,
    soundTone: Math.round(report.soundTone * 100),
    guides: report.guides === false ? "off" : report.guides,
    floor: report.floor === false ? "off" : report.floor,
  }),
  toTuning: (values) => ({
    rotation: values.rotation as number | undefined,
    elevation: values.elevation as number | undefined,
    depth: values.depth as number | undefined,
    material: values.material as IsometricMaterial | undefined,
    interactive: values.interactive as boolean | undefined,
    highlight: values.highlight as boolean | undefined,
    sound: values.sound as boolean | undefined,
    soundTone:
      values.soundTone === undefined
        ? undefined
        : (values.soundTone as number) / 100,
    floor: offToFalse(values.floor) as IsometricMarkTuning["floor"],
    guides: offToFalse(values.guides) as IsometricMarkTuning["guides"],
  }),
})
