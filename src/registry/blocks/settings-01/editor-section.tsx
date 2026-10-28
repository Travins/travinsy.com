import { ControlPanelGroup } from "@/registry/ui/control-panel/control-panel"
import { SegmentedControl } from "@/registry/ui/segmented-control/segmented-control"
import { ToggleSwitch } from "@/registry/ui/toggle-switch/toggle-switch"
import { ValueSlider } from "@/registry/ui/value-slider/value-slider"

import { EditorPreview } from "./previews"
import { SectionLayout, type SectionProps } from "./section-layout"
import type { IndentWidth } from "./types"

/** 编辑器：缩进、行高与制表符显示，右侧是代码预览。 */
function EditorSection(props: SectionProps) {
  const { values, labels, set, modified } = props
  const tone = values.accent
  return (
    <SectionLayout
      id="editor"
      {...props}
      aside={<EditorPreview values={values} labels={labels} />}
    >
      <ControlPanelGroup title={labels.groupIndent}>
        <SegmentedControl
          label={labels.indent}
          tone={tone}
          value={values.indent}
          onValueChange={(next) => set("indent", next as IndentWidth)}
          modified={modified("indent")}
          options={[
            { value: "2", label: labels.indentTwo },
            { value: "4", label: labels.indentFour },
            { value: "tab", label: labels.indentTab },
          ]}
        />
        <ValueSlider
          label={labels.lineHeight}
          tone={tone}
          editable
          min={1.2}
          max={2}
          step={0.1}
          value={values.lineHeight}
          onValueChange={(next) => set("lineHeight", next)}
          modified={modified("lineHeight")}
        />
      </ControlPanelGroup>
      <ControlPanelGroup title={labels.groupWhitespace}>
        <ToggleSwitch
          label={labels.showTabs}
          description={labels.showTabsHint}
          tone={tone}
          checked={values.showTabs}
          onCheckedChange={(next) => set("showTabs", next)}
          modified={modified("showTabs")}
        />
      </ControlPanelGroup>
    </SectionLayout>
  )
}

export { EditorSection }
