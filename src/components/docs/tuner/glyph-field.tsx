import {
  GlyphFieldTuningContext,
  type GlyphFieldReport,
  type GlyphFieldTuning,
} from "@/registry/ui/glyph-field/glyph-field"
import { toneOptions } from "./swatches"
import { defineTuner } from "./types"

/**
 * 字符矩阵的调整面板：字符集、渐隐、字号、密度、速度、色调与暂停。
 * 容器高度由示例的 className 决定，字号和密度只改变画布里的字符，容器大小不变。
 */

const own = { value: "own", label: "原样" }
const PRESETS = ["latin", "binary", "hex", "katakana", "cjk"]

export const glyphFieldTuner = defineTuner<GlyphFieldTuning, GlyphFieldReport>({
  hint: "调整字符集、字号与密度",
  component: "GlyphField",
  context: GlyphFieldTuningContext,
  controls: [
    {
      key: "glyphs",
      type: "segmented",
      label: "字符集 glyphs",
      span: 2,
      options: [
        own,
        { value: "latin", label: "拉丁" },
        { value: "binary", label: "二进制" },
        { value: "hex", label: "十六进制" },
        { value: "katakana", label: "片假名" },
        { value: "cjk", label: "汉字" },
      ],
    },
    {
      key: "fade",
      type: "segmented",
      label: "渐隐 fade",
      options: [
        { value: "edges", label: "四周" },
        { value: "center", label: "中心" },
        { value: "none", label: "无" },
      ],
    },
    {
      key: "fontSize",
      type: "slider",
      label: "字号 fontSize",
      unit: "px",
      min: 8,
      max: 28,
    },
    {
      key: "density",
      type: "slider",
      label: "密度 density",
      min: 0.1,
      max: 1,
      step: 0.05,
    },
    {
      key: "speed",
      type: "slider",
      label: "速度 speed",
      min: 0.01,
      max: 0.2,
      step: 0.01,
    },
    {
      key: "tone",
      type: "tone",
      label: "色调 tone",
      options: toneOptions(own),
    },
    { key: "paused", type: "switch", label: "暂停 paused" },
  ],
  defaults: {
    glyphs: "own",
    tone: "own",
    fade: "edges",
    fontSize: 14,
    density: 0.8,
    speed: 0.04,
    paused: false,
  },
  fromReport: (report) => ({
    // 自定义字符集、混合色调不在选项里，显示为「原样」
    glyphs: PRESETS.includes(report.glyphs) ? report.glyphs : "own",
    tone:
      typeof report.tone !== "string"
        ? "own"
        : report.tone === "muted"
          ? "theme"
          : report.tone,
    fade: report.fade,
    fontSize: report.fontSize,
    density: report.density,
    speed: report.speed,
    paused: report.paused,
  }),
  toTuning: (values) => ({
    glyphs:
      values.glyphs === undefined || values.glyphs === "own"
        ? undefined
        : (values.glyphs as string),
    // 「主题」是不上色的默认灰，即 muted
    tone:
      values.tone === undefined || values.tone === "own"
        ? undefined
        : values.tone === "theme"
          ? "muted"
          : (values.tone as string),
    fade: values.fade as GlyphFieldTuning["fade"],
    fontSize: values.fontSize as number | undefined,
    density: values.density as number | undefined,
    speed: values.speed as number | undefined,
    paused: values.paused as boolean | undefined,
  }),
})
