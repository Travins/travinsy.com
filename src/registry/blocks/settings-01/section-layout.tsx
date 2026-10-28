import type * as React from "react"
import { useId } from "react"

import { cn } from "@/lib/utils"
import {
  ControlPanel,
  ControlPanelActions,
  ControlPanelCopy,
  ControlPanelHeader,
  ControlPanelReset,
  ControlPanelTitle,
} from "@/registry/ui/control-panel/control-panel"

import {
  SECTION_LABEL_KEYS,
  formatLabel,
  type Settings01Labels,
} from "./config"
import type { Settings01SectionId, Settings01Values } from "./types"

type SetValue = <Key extends keyof Settings01Values>(
  key: Key,
  value: Settings01Values[Key],
) => void

/** 每个分区组件收到的同一组属性 */
type SectionProps = {
  values: Settings01Values
  labels: Settings01Labels
  set: SetValue
  /** 某一项是否与默认值不同，传给控件的 `modified` */
  modified: (key: keyof Settings01Values) => boolean
  /** 本分区有几项不是默认值 */
  count: number
  /** 把本分区恢复为默认值 */
  onReset: () => void
  /** 本分区当前取值的 JSON，复制按钮用 */
  getCode: () => string
}

/**
 * 分区外壳：标题与说明 + 控制面板（头部显示本分区已修改项数，带复制与恢复）。
 * 有 `aside` 时在宽屏放到右侧，窄屏排在面板上方。
 */
function SectionLayout({
  id,
  labels,
  count,
  onReset,
  getCode,
  aside,
  children,
}: Pick<SectionProps, "labels" | "count" | "onReset" | "getCode"> & {
  id: Settings01SectionId
  aside?: React.ReactNode
  children: React.ReactNode
}) {
  const headingId = useId()
  const keys = SECTION_LABEL_KEYS[id]
  return (
    <section
      id={`settings-01-${id}`}
      aria-labelledby={headingId}
      data-slot="settings-01-section"
      data-section={id}
      className="flex flex-col gap-4"
    >
      <header>
        <h2
          id={headingId}
          className="text-base font-semibold tracking-tight"
        >
          {labels[keys.title]}
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {labels[keys.description]}
        </p>
      </header>
      <div
        className={cn(
          "grid items-start gap-6",
          aside && "lg:grid-cols-[minmax(0,1fr)_16rem]",
        )}
      >
        <ControlPanel className={cn("max-w-2xl", aside && "lg:max-w-none")}>
          <ControlPanelHeader>
            <ControlPanelTitle>
              {count > 0
                ? formatLabel(labels.panelModified, { count })
                : labels.panelDefault}
            </ControlPanelTitle>
            <ControlPanelActions>
              <ControlPanelCopy
                code={getCode}
                label={labels.copySection}
                copiedLabel={labels.copiedSection}
              />
              <ControlPanelReset
                label={labels.resetSection}
                disabled={count === 0}
                onClick={onReset}
              />
            </ControlPanelActions>
          </ControlPanelHeader>
          {children}
        </ControlPanel>
        {aside ? (
          <div
            data-slot="settings-01-aside"
            className="order-first lg:sticky lg:top-6 lg:order-none"
          >
            {aside}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export { SectionLayout }
export type { SectionProps, SetValue }
