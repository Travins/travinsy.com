import { Volume2, VolumeX } from "lucide-react"

import { ControlPanelGroup } from "@/registry/ui/control-panel/control-panel"
import { SegmentedControl } from "@/registry/ui/segmented-control/segmented-control"
import { ToggleSwitch } from "@/registry/ui/toggle-switch/toggle-switch"
import { ValueSlider } from "@/registry/ui/value-slider/value-slider"

import { SectionLayout, type SectionProps } from "./section-layout"
import type { SoundTheme } from "./types"

/** 声音与触感：主音量带拖动音效，音色在按键音效关闭时禁用。 */
function SoundSection(props: SectionProps) {
  const { values, labels, set, modified } = props
  const tone = values.accent
  return (
    <SectionLayout id="sound" {...props}>
      <ControlPanelGroup title={labels.groupVolume}>
        <ValueSlider
          label={labels.volume}
          tone={tone}
          sound
          editable
          min={0}
          max={100}
          step={1}
          startIcon={<VolumeX />}
          endIcon={<Volume2 />}
          value={values.volume}
          onValueChange={(next) => set("volume", next)}
          modified={modified("volume")}
        />
      </ControlPanelGroup>
      <ControlPanelGroup title={labels.groupFeedback} columns={2}>
        <ToggleSwitch
          label={labels.keySound}
          description={labels.keySoundHint}
          tone={tone}
          checked={values.keySound}
          onCheckedChange={(next) => set("keySound", next)}
          modified={modified("keySound")}
        />
        <ToggleSwitch
          label={labels.haptics}
          description={labels.hapticsHint}
          tone={tone}
          checked={values.haptics}
          onCheckedChange={(next) => set("haptics", next)}
          modified={modified("haptics")}
        />
        <SegmentedControl
          className="sm:col-span-2"
          label={labels.soundTheme}
          tone={tone}
          disabled={!values.keySound}
          value={values.soundTheme}
          onValueChange={(next) => set("soundTheme", next as SoundTheme)}
          modified={modified("soundTheme")}
          options={[
            { value: "soft", label: labels.soundSoft },
            { value: "crisp", label: labels.soundCrisp },
            { value: "mechanical", label: labels.soundMechanical },
          ]}
        />
      </ControlPanelGroup>
    </SectionLayout>
  )
}

export { SoundSection }
