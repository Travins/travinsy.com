import { ControlPanelGroup } from "@/registry/ui/control-panel/control-panel"
import { SegmentedControl } from "@/registry/ui/segmented-control/segmented-control"
import { ToggleSwitch } from "@/registry/ui/toggle-switch/toggle-switch"
import { ValueSlider } from "@/registry/ui/value-slider/value-slider"

import { formatLabel } from "./config"
import { SectionLayout, type SectionProps } from "./section-layout"
import type { ProfileVisibility } from "./types"

/** 隐私：资料可见范围、数据收集开关与历史保留天数。 */
function PrivacySection(props: SectionProps) {
  const { values, labels, set, modified } = props
  const tone = values.accent
  return (
    <SectionLayout id="privacy" {...props}>
      <ControlPanelGroup title={labels.groupProfile}>
        <SegmentedControl
          label={labels.visibility}
          tone={tone}
          value={values.visibility}
          onValueChange={(next) => set("visibility", next as ProfileVisibility)}
          modified={modified("visibility")}
          options={[
            { value: "public", label: labels.visibilityPublic },
            { value: "team", label: labels.visibilityTeam },
            { value: "private", label: labels.visibilityPrivate },
          ]}
        />
      </ControlPanelGroup>
      <ControlPanelGroup title={labels.groupData} columns={2}>
        <ToggleSwitch
          label={labels.analytics}
          description={labels.analyticsHint}
          tone={tone}
          checked={values.analytics}
          onCheckedChange={(next) => set("analytics", next)}
          modified={modified("analytics")}
        />
        <ToggleSwitch
          label={labels.crashReports}
          description={labels.crashReportsHint}
          tone={tone}
          checked={values.crashReports}
          onCheckedChange={(next) => set("crashReports", next)}
          modified={modified("crashReports")}
        />
        <ValueSlider
          className="sm:col-span-2"
          label={labels.retention}
          tone={tone}
          editable
          min={7}
          max={365}
          step={1}
          largeStep={30}
          ticks={[30, 90, 180]}
          snapToTicks
          formatValue={(value) => formatLabel(labels.readoutDays, { value })}
          value={values.retention}
          onValueChange={(next) => set("retention", next)}
          modified={modified("retention")}
        />
      </ControlPanelGroup>
    </SectionLayout>
  )
}

export { PrivacySection }
