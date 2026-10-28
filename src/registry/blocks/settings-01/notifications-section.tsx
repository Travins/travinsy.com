import { ControlPanelGroup } from "@/registry/ui/control-panel/control-panel"
import { ToggleSwitch } from "@/registry/ui/toggle-switch/toggle-switch"
import { ValueSlider } from "@/registry/ui/value-slider/value-slider"

import { SectionLayout, type SectionProps } from "./section-layout"
import { formatHour } from "./utils"

/** 一天里从中午到次日中午，免打扰通常跨午夜，所以滑块范围取 12–36 */
const QUIET_MIN = 12
const QUIET_MAX = 36

/** 通知：总开关控制其余开关的禁用态，免打扰时段是区间滑块。 */
function NotificationsSection(props: SectionProps) {
  const { values, labels, set, modified } = props
  const tone = values.accent
  const off = !values.notifications
  return (
    <SectionLayout id="notifications" {...props}>
      <ControlPanelGroup title={labels.groupChannels} columns={2}>
        <ToggleSwitch
          className="sm:col-span-2"
          label={labels.notifications}
          description={labels.notificationsHint}
          tone={tone}
          checked={values.notifications}
          onCheckedChange={(next) => set("notifications", next)}
          modified={modified("notifications")}
        />
        <ToggleSwitch
          label={labels.notifyMentions}
          description={labels.notifyMentionsHint}
          tone={tone}
          disabled={off}
          checked={values.notifyMentions}
          onCheckedChange={(next) => set("notifyMentions", next)}
          modified={modified("notifyMentions")}
        />
        <ToggleSwitch
          label={labels.notifyReplies}
          description={labels.notifyRepliesHint}
          tone={tone}
          disabled={off}
          checked={values.notifyReplies}
          onCheckedChange={(next) => set("notifyReplies", next)}
          modified={modified("notifyReplies")}
        />
        <ToggleSwitch
          label={labels.notifyEmail}
          description={labels.notifyEmailHint}
          tone={tone}
          disabled={off}
          checked={values.notifyEmail}
          onCheckedChange={(next) => set("notifyEmail", next)}
          modified={modified("notifyEmail")}
        />
        <ToggleSwitch
          label={labels.notifyUpdates}
          description={labels.notifyUpdatesHint}
          tone={tone}
          disabled={off}
          checked={values.notifyUpdates}
          onCheckedChange={(next) => set("notifyUpdates", next)}
          modified={modified("notifyUpdates")}
        />
      </ControlPanelGroup>
      <ControlPanelGroup title={labels.groupQuiet}>
        {/* 区间读数较长，用矮轨让标签与读数排在轨道上方，窄屏也不会被手柄压住 */}
        <ValueSlider
          label={labels.quietHours}
          variant="slim"
          tone={tone}
          min={QUIET_MIN}
          max={QUIET_MAX}
          step={0.5}
          largeStep={3}
          minStepsBetweenValues={1}
          ticks={[18, 24, 30]}
          disabled={off}
          formatValue={formatHour}
          value={values.quietHours}
          onValueChange={(next) => set("quietHours", [next[0], next[1]])}
          modified={modified("quietHours")}
        />
      </ControlPanelGroup>
    </SectionLayout>
  )
}

export { NotificationsSection }
