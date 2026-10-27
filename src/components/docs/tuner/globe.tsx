import {
  GlobeTuningContext,
  type GlobeReport,
  type GlobeTuning,
} from "@/registry/ui/globe/globe"
import { toneOptions } from "./swatches"
import { defineTuner } from "./types"

/**
 * 点阵地球的调整面板：自转速度、水平角、点阵密度、点阵与标记色调，以及标签与暂停。
 * 外框是固定的正方形，球体大小不随参数变化；水平角是直接转到该角度，之后继续自转。
 * 点阵密度越大越吃显卡，上限取 40000。
 */

const toDegrees = (radians: number) => Math.round((radians * 180) / Math.PI)

/** 面板的「主题」对应主题前景色 */
const themeToForeground = (value: string | undefined) =>
  value === undefined ? undefined : value === "theme" ? "foreground" : value

export const globeTuner = defineTuner<GlobeTuning, GlobeReport>({
  hint: "调整转速、点阵与色调",
  context: GlobeTuningContext,
  controls: [
    {
      key: "speed",
      type: "slider",
      label: "转速 speed",
      unit: " rad/s",
      min: -0.6,
      max: 0.6,
      step: 0.02,
    },
    {
      key: "phi",
      type: "slider",
      label: "水平角 phi",
      unit: "°",
      min: -360,
      max: 360,
    },
    {
      key: "mapSamples",
      type: "slider",
      label: "点阵密度 mapSamples",
      min: 2000,
      max: 40000,
      step: 1000,
    },
    {
      key: "dotTone",
      type: "segmented",
      label: "点阵色调 dotTone",
      span: 3,
      options: toneOptions(),
    },
    {
      key: "markerTone",
      type: "segmented",
      label: "标记色调 markerTone",
      span: 3,
      options: toneOptions(),
    },
    { key: "labels", type: "switch", label: "城市标签 labels" },
    { key: "paused", type: "switch", label: "暂停 paused" },
  ],
  defaults: {
    speed: 0.12,
    phi: -194,
    mapSamples: 16000,
    labels: false,
    paused: false,
  },
  fromReport: (report) => ({
    speed: report.speed,
    phi: toDegrees(report.phi),
    mapSamples: report.mapSamples,
    dotTone: report.dotTone === "foreground" ? "theme" : report.dotTone,
    markerTone:
      report.markerTone === "foreground" ? "theme" : report.markerTone,
    labels: report.labels,
    paused: report.paused,
  }),
  toTuning: (values) => ({
    speed: values.speed as number | undefined,
    phi:
      values.phi === undefined
        ? undefined
        : ((values.phi as number) * Math.PI) / 180,
    mapSamples: values.mapSamples as number | undefined,
    dotTone: themeToForeground(values.dotTone as string | undefined),
    markerTone: themeToForeground(values.markerTone as string | undefined),
    labels: values.labels as boolean | undefined,
    paused: values.paused as boolean | undefined,
  }),
})
