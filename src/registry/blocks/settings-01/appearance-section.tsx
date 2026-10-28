import { Monitor, Moon, Sun } from "lucide-react"

import { ControlPanelGroup } from "@/registry/ui/control-panel/control-panel"
import { SegmentedControl } from "@/registry/ui/segmented-control/segmented-control"
import { ToggleSwitch } from "@/registry/ui/toggle-switch/toggle-switch"
import { TonePicker } from "@/registry/ui/tone-picker/tone-picker"
import { ValueSlider } from "@/registry/ui/value-slider/value-slider"

import { formatLabel } from "./config"
import { AppearancePreview } from "./previews"
import { SectionLayout, type SectionProps } from "./section-layout"
import type { Density, ThemeMode } from "./types"

/** 外观：主题、强调色、字号、圆角、信息密度、动态效果，右侧是实时预览。 */
function AppearanceSection(props: SectionProps) {
  const { values, labels, set, modified } = props
  const tone = values.accent
  return (
    <SectionLayout
      id="appearance"
      {...props}
      aside={<AppearancePreview values={values} labels={labels} />}
    >
      <ControlPanelGroup title={labels.groupTheme}>
        <SegmentedControl
          label={labels.theme}
          tone={tone}
          value={values.theme}
          onValueChange={(next) => set("theme", next as ThemeMode)}
          modified={modified("theme")}
          options={[
            { value: "light", label: labels.themeLight, icon: <Sun /> },
            { value: "dark", label: labels.themeDark, icon: <Moon /> },
            { value: "system", label: labels.themeSystem, icon: <Monitor /> },
          ]}
        />
        <TonePicker
          label={labels.accent}
          value={values.accent}
          onValueChange={(next) => set("accent", next)}
          modified={modified("accent")}
        />
      </ControlPanelGroup>
      <ControlPanelGroup title={labels.groupShape} columns={2}>
        <ValueSlider
          label={labels.fontSize}
          tone={tone}
          min={12}
          max={20}
          step={1}
          editable
          formatValue={(value) =>
            formatLabel(labels.readoutPx, { value })
          }
          value={values.fontSize}
          onValueChange={(next) => set("fontSize", next)}
          modified={modified("fontSize")}
        />
        <ValueSlider
          label={labels.radius}
          tone={tone}
          min={0}
          max={20}
          step={1}
          editable
          formatValue={(value) =>
            formatLabel(labels.readoutPx, { value })
          }
          value={values.radius}
          onValueChange={(next) => set("radius", next)}
          modified={modified("radius")}
        />
        <SegmentedControl
          className="sm:col-span-2"
          label={labels.density}
          tone={tone}
          value={values.density}
          onValueChange={(next) => set("density", next as Density)}
          modified={modified("density")}
          options={[
            { value: "compact", label: labels.densityCompact },
            { value: "comfortable", label: labels.densityComfortable },
            { value: "spacious", label: labels.densitySpacious },
          ]}
        />
      </ControlPanelGroup>
      <ControlPanelGroup title={labels.groupMotion}>
        <ToggleSwitch
          label={labels.reduceMotion}
          description={labels.reduceMotionHint}
          tone={tone}
          checked={values.reduceMotion}
          onCheckedChange={(next) => set("reduceMotion", next)}
          modified={modified("reduceMotion")}
        />
      </ControlPanelGroup>
    </SectionLayout>
  )
}

export { AppearanceSection }
