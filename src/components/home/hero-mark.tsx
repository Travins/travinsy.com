"use client"

import { useId, useState } from "react"
import { SlidersHorizontal } from "lucide-react"

import { MaterialSwatch } from "@/components/docs/tuner/material-swatch"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  ControlPanel,
  ControlPanelActions,
  ControlPanelGroup,
  ControlPanelHeader,
  ControlPanelReset,
  ControlPanelTitle,
} from "@/registry/ui/control-panel/control-panel"
import {
  IsometricMark,
  useIsometricMarkMuted,
  type IsometricShape,
} from "@/registry/ui/isometric-mark/isometric-mark"
import { SegmentedControl } from "@/registry/ui/segmented-control/segmented-control"
import { ToggleSwitch } from "@/registry/ui/toggle-switch/toggle-switch"
import { TonePicker } from "@/registry/ui/tone-picker/tone-picker"
import { XyPad } from "@/registry/ui/xy-pad/xy-pad"

// 本站标志「易」：上三道细斜杠是「日」，下三道粗斜杠是「勿」，右端齐平；坐标与站点 SVG 标志相同
const LOGO: readonly (readonly [number, number])[][] = [
  [
    [156, 130],
    [416, 0],
    [416, 36],
    [156, 166],
  ],
  [
    [156, 192],
    [416, 62],
    [416, 98],
    [156, 228],
  ],
  [
    [156, 254],
    [416, 124],
    [416, 160],
    [156, 290],
  ],
  [
    [0, 394],
    [416, 186],
    [416, 258],
    [0, 466],
  ],
  [
    [78, 453],
    [416, 284],
    [416, 356],
    [78, 525],
  ],
  [
    [156, 512],
    [416, 382],
    [416, 454],
    [156, 584],
  ],
]

/** 上三道细斜杠可选的色调；值对应 `--flow-*` 变量，主题色直接取 `--primary`。 */
const TONES = [
  "primary",
  "blue",
  "green",
  "amber",
  "rose",
  "violet",
  "cyan",
] as const
type Tone = (typeof TONES)[number]

/** 同一色调由浅到深（从后往前）；每种色调的形状数组在模块里算好，切换时不重算几何。 */
function buildShapes(tone: Tone): readonly IsometricShape[] {
  const base = tone === "primary" ? "var(--primary)" : `var(--flow-${tone})`
  const tones = [
    `color-mix(in oklab, ${base} 55%, var(--background))`,
    `color-mix(in oklab, ${base} 78%, var(--background))`,
    base,
  ]
  return LOGO.map((bar, index) => ({
    outer: [...bar],
    tone: tones[index],
  }))
}
const SHAPES: Record<Tone, readonly IsometricShape[]> = Object.fromEntries(
  TONES.map((tone) => [tone, buildShapes(tone)]),
) as Record<Tone, readonly IsometricShape[]>

type Material = "lines" | "hatch" | "cross" | "dots"
type Floor = "grid" | "lines" | "dots" | "off"

const MATERIALS: { value: Material; label: string }[] = [
  { value: "lines", label: "横纹" },
  { value: "hatch", label: "斜纹" },
  { value: "cross", label: "网纹" },
  { value: "dots", label: "点阵" },
]
const FLOORS: { value: Floor; label: string }[] = [
  { value: "grid", label: "方格" },
  { value: "lines", label: "条纹" },
  { value: "dots", label: "格点" },
  { value: "off", label: "无" },
]
const MATERIAL_OPTIONS = MATERIALS.map((option) => ({
  ...option,
  icon: <MaterialSwatch material={option.value} />,
}))

/** 初始值与改版前的首页标志一致 */
const DEFAULTS = {
  view: { x: -65, y: 35 },
  material: "lines" as Material,
  floor: "grid" as Floor,
  tone: "primary" as Tone,
}

const degrees = (value: number) => `${value}°`

/**
 * 首屏面板里的控件底色：默认的 `bg-muted/60` 叠在半透明面板上整体偏灰，
 * 这里减淡一半，分段选择里收放选项的浅槽也同步减淡，让首屏更通透；选中块、开关轨道等前景层次不变。
 */
const CONTROL_SURFACE =
  "bg-muted/30 dark:bg-muted/40 **:data-[slot=segmented-control-options]:bg-foreground/3 dark:**:data-[slot=segmented-control-options]:bg-foreground/7"

/**
 * 首屏右栏：本站标志加一个小控制面板，访客直接在首页调视角、材质、地面与音效。
 * 面板的值用普通 props 受控传给标志；音效开关与全站共用同一个静音偏好。
 * 宽屏面板固定在栏底；窄屏收起，点「调一调」展开。
 */
function HeroMark() {
  const [view, setView] = useState(DEFAULTS.view)
  const [material, setMaterial] = useState<Material>(DEFAULTS.material)
  const [floor, setFloor] = useState<Floor>(DEFAULTS.floor)
  const [tone, setTone] = useState<Tone>(DEFAULTS.tone)
  const [muted, setMuted] = useIsometricMarkMuted()
  const [open, setOpen] = useState(false)
  const panelId = useId()

  const reset = () => {
    setView(DEFAULTS.view)
    setMaterial(DEFAULTS.material)
    setFloor(DEFAULTS.floor)
    setTone(DEFAULTS.tone)
    setMuted(false)
  }

  return (
    <div className="relative flex min-w-0 flex-col lg:h-full">
      {/*
        舞台：底纹只由面板里的「地面」决定，不再另铺一层点阵——否则选「无」时点阵还在，看起来像设置没生效
      */}
      <div className="relative isolate h-80 overflow-hidden sm:h-96 lg:h-auto lg:min-h-72 lg:flex-1">
        {/* 主题色光晕：从标志下方向外晕开，颜色随主题变化 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_42%_at_50%_62%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_75%)]"
        />
        {/* 标志按画框等比缩放：视角转到更高更窄时也不会超出舞台 */}
        <div className="absolute inset-0 flex items-center justify-center px-6 py-8">
          <IsometricMark
            className="size-full"
            shapes={SHAPES[tone]}
            rotation={view.x}
            elevation={view.y}
            depth={52}
            material={material}
            label="易"
            guides="edges"
            floor={floor === "off" ? false : floor}
            sound={!muted}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="absolute right-3 bottom-3 bg-background/80 lg:hidden"
        >
          <SlidersHorizontal data-icon="inline-start" />
          {open ? "收起" : "调一调"}
        </Button>
      </div>
      <ControlPanel
        id={panelId}
        role="group"
        aria-label="标志调整面板"
        className={cn(
          "rounded-none border-0 border-t bg-background/80 backdrop-blur-sm",
          !open && "max-lg:hidden",
        )}
      >
        <ControlPanelHeader className="h-9 border-b-0 pb-0">
          <ControlPanelTitle>调一调</ControlPanelTitle>
          <ControlPanelActions>
            <ControlPanelReset label="恢复默认" onClick={reset} />
          </ControlPanelActions>
        </ControlPanelHeader>
        <ControlPanelGroup className="pt-1">
          <div className="grid gap-x-4 gap-y-2 sm:grid-cols-[minmax(0,8rem)_minmax(0,1fr)] lg:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)]">
            <XyPad
              className={cn(
                "aspect-[2/1] sm:aspect-auto sm:h-full sm:min-h-28",
                CONTROL_SURFACE,
              )}
              label="视角"
              x={{
                min: -180,
                max: 180,
                label: "朝向",
                format: degrees,
              }}
              y={{ min: 5, max: 85, label: "俯仰", format: degrees }}
              value={view}
              modified={
                view.x !== DEFAULTS.view.x || view.y !== DEFAULTS.view.y
              }
              onValueChange={setView}
            />
            <div className="flex min-w-0 flex-col gap-2">
              <SegmentedControl
                className={cn("text-xs", CONTROL_SURFACE)}
                label="材质"
                options={MATERIAL_OPTIONS}
                value={material}
                modified={material !== DEFAULTS.material}
                onValueChange={(value) => setMaterial(value as Material)}
              />
              <SegmentedControl
                className={cn("text-xs", CONTROL_SURFACE)}
                label="地面"
                options={FLOORS}
                value={floor}
                modified={floor !== DEFAULTS.floor}
                onValueChange={(value) => setFloor(value as Floor)}
              />
              {/* 色调与音效并成一行，面板少一行高，首屏高度不被右栏撑大 */}
              <div className="flex min-w-0 gap-2">
                <TonePicker
                  className={cn("min-w-0 flex-1 text-xs", CONTROL_SURFACE)}
                  label="色调"
                  value={tone}
                  modified={tone !== DEFAULTS.tone}
                  onValueChange={(value) => setTone(value as Tone)}
                />
                <ToggleSwitch
                  className={cn(
                    "w-auto shrink-0 gap-3 text-xs",
                    CONTROL_SURFACE,
                  )}
                  label="音效"
                  checked={!muted}
                  modified={muted}
                  onCheckedChange={(checked) => setMuted(!checked)}
                />
              </div>
            </div>
          </div>
        </ControlPanelGroup>
      </ControlPanel>
    </div>
  )
}

export { HeroMark }
