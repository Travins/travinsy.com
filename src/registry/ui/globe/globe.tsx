"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { flowToneStyle } from "@/registry/ui/flow-diagram/tone"
import { anglesFor } from "./projection"
import type { GlobeArc, GlobeMarker, GlobeTone } from "./types"
import { useGlobe } from "./use-globe"

// 默认视角：正对东亚，略微俯视
const DEFAULT_VIEW = anglesFor([24, 104])

type GlobeProps = Omit<React.ComponentProps<"div">, "children"> & {
  /**
   * 标记点；`label` 填城市名，读屏会逐个朗读，开启 `labels` 后显示为胶囊
   * @default []
   */
  markers?: GlobeMarker[]
  /**
   * 两点之间的弧线
   * @default []
   */
  arcs?: GlobeArc[]
  /**
   * 点阵（陆地）的色调
   * @default "foreground"
   */
  dotTone?: GlobeTone
  /**
   * 标记的默认色调
   * @default "primary"
   */
  markerTone?: GlobeTone
  /**
   * 弧线的默认色调
   * @default "primary"
   */
  arcTone?: GlobeTone
  /**
   * 自转速度，单位弧度 / 秒；负值反向
   * @default 0.12
   */
  speed?: number
  /** 初始水平角（弧度），默认正对东亚；`globeAngles([纬度, 经度])` 可以算出对准某个地点的角度 */
  phi?: number
  /** 初始俯仰角（弧度）；拖拽松手后会回到这个角度 */
  theta?: number
  /**
   * 允许拖拽旋转，松手后带惯性并恢复自转；键盘左右方向键也可旋转
   * @default false
   */
  draggable?: boolean
  /**
   * 暂停自转；拖拽和聚焦不受影响
   * @default false
   */
  paused?: boolean
  /**
   * 陆地点阵的采样数，越大越密，也越吃显卡
   * @default 16000
   */
  mapSamples?: number
  /**
   * 在标记旁显示城市名胶囊（背面时自动隐藏）；单个标记的 `showLabel` 优先
   * @default false
   */
  labels?: boolean
  /** 让地球缓动转向并停在 `[纬度, 经度]`，传 `null` 恢复自转 */
  focus?: [number, number] | null
  /** 图示说明；不传时作为装饰隐藏（可拖拽时回落到默认说明） */
  label?: string
}

/**
 * 点阵地球：WebGL 绘制陆地点阵、标记与弧线，颜色取自主题变量，
 * 亮暗模式和颜色主题切换时自动更新。尺寸由外框决定，外框是正方形，球体占其中约 80%。
 */
function Globe({
  className,
  markers = [],
  arcs = [],
  dotTone = "foreground",
  markerTone = "primary",
  arcTone = "primary",
  speed = 0.12,
  phi = DEFAULT_VIEW.phi,
  theta = DEFAULT_VIEW.theta,
  draggable = false,
  paused = false,
  mapSamples = 16000,
  labels = false,
  focus,
  label = draggable ? "可旋转的地球" : undefined,
  ...props
}: GlobeProps) {
  const { rootRef, hostRef, labelRefs, ready, dragging, handlers } = useGlobe({
    markers,
    arcs,
    dotTone,
    markerTone,
    arcTone,
    speed,
    phi,
    theta,
    draggable,
    paused,
    mapSamples,
    focus,
  })
  const cities = markers.flatMap((marker) =>
    marker.label ? [marker.label] : [],
  )
  const description = label
    ? cities.length
      ? `${label}，标注：${cities.join("、")}`
      : label
    : undefined
  return (
    <div
      {...props}
      {...handlers}
      ref={rootRef}
      data-slot="globe"
      data-ready={ready || undefined}
      data-dragging={dragging || undefined}
      role={draggable && label ? "group" : label ? "img" : undefined}
      aria-roledescription={draggable && label ? "可旋转的地球" : undefined}
      aria-label={description}
      aria-hidden={label ? undefined : true}
      tabIndex={draggable && label ? 0 : undefined}
      className={cn(
        "group/globe relative aspect-square w-full select-none",
        draggable &&
          "cursor-grab touch-pan-y rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50 data-dragging:cursor-grabbing",
        className,
      )}
    >
      {/* 画布出来之前（含服务端输出）先占位，尺寸与球体一致，避免布局跳动 */}
      <div
        data-slot="globe-placeholder"
        aria-hidden="true"
        className="pointer-events-none absolute inset-[10%] rounded-full border border-edge bg-[radial-gradient(circle_at_35%_30%,var(--edge),transparent_70%)] transition-opacity duration-700 group-data-ready/globe:opacity-0"
      />
      <div
        ref={hostRef}
        data-slot="globe-canvas"
        className="absolute inset-0"
      />
      <div
        data-slot="globe-labels"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        {markers.map((marker, index) =>
          (marker.showLabel ?? labels) && marker.label ? (
            <div
              key={`${marker.label}-${index}`}
              ref={(node) => {
                labelRefs.current[index] = node
              }}
              data-slot="globe-label"
              className="absolute top-0 left-0 opacity-0 will-change-transform"
              style={flowToneStyle(marker.tone ?? markerTone)}
            >
              <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1.5 rounded-full border border-edge bg-background/80 py-0.5 pr-2 pl-1.5 text-[11px] leading-4 font-medium whitespace-nowrap shadow-xs backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-(--flow-tone)" />
                {marker.label}
              </span>
            </div>
          ) : null,
        )}
      </div>
    </div>
  )
}

type GlobeLegendProps = React.ComponentProps<"ul"> & {
  markers: GlobeMarker[]
  /**
   * 默认色调，与 `Globe` 的 `markerTone` 保持一致
   * @default "primary"
   */
  markerTone?: GlobeTone
  /**
   * 同时列出经纬度（等宽字体）
   * @default false
   */
  coordinates?: boolean
}

/** 标记图例：名称配彩色圆点，可选经纬度；放在地球旁边，给不依赖颜色与动画的文字版本。 */
function GlobeLegend({
  className,
  markers,
  markerTone = "primary",
  coordinates = false,
  ...props
}: GlobeLegendProps) {
  return (
    <ul
      data-slot="globe-legend"
      className={cn("flex flex-col gap-1.5 text-sm", className)}
      {...props}
    >
      {markers.map((marker, index) =>
        marker.label ? (
          <li
            key={`${marker.label}-${index}`}
            data-slot="globe-legend-item"
            className="flex items-center gap-2"
            style={flowToneStyle(marker.tone ?? markerTone)}
          >
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-full bg-(--flow-tone)"
            />
            <span className="truncate">{marker.label}</span>
            {coordinates ? (
              <span className="ml-auto font-mono text-xs text-muted-foreground tabular-nums">
                {marker.location[0].toFixed(1)}°,{" "}
                {marker.location[1].toFixed(1)}°
              </span>
            ) : null}
          </li>
        ) : null,
      )}
    </ul>
  )
}

export { Globe, GlobeLegend, anglesFor as globeAngles }
export type { GlobeArc, GlobeLegendProps, GlobeMarker, GlobeProps, GlobeTone }
