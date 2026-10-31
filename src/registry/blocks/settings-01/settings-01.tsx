"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Check, LoaderCircle, Settings } from "lucide-react"
import { useMemo, useState, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/hooks/use-controllable-state"
import { flowToneStyle } from "@/registry/lib/flow-tone"

import { Settings01Changes } from "./changes"
import { AppearanceSection } from "./appearance-section"
import {
  DEFAULT_VALUES,
  SECTION_IDS,
  SECTION_KEYS,
  resolveLabels,
  type Settings01Labels,
} from "./config"
import { EditorSection } from "./editor-section"
import { NotificationsSection } from "./notifications-section"
import { PrivacySection } from "./privacy-section"
import type { SectionProps, SetValue } from "./section-layout"
import { SectionNav, SectionTabs } from "./section-nav"
import { SoundSection } from "./sound-section"
import type { Settings01SectionId, Settings01Values } from "./types"
import { useSaveAction } from "./use-save-action"
import { isSameValue } from "./utils"

const SECTIONS: Record<
  Settings01SectionId,
  (props: SectionProps) => ReactNode
> = {
  appearance: AppearanceSection,
  notifications: NotificationsSection,
  sound: SoundSection,
  editor: EditorSection,
  privacy: PrivacySection,
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
// 未传回调时的示例实现：只在控制台打印，并模拟 0.8 秒的网络请求
async function demoSave(values: Settings01Values) {
  console.info("[settings-01] onSave", values)
  await wait(800)
}

function pickKeys(
  values: Settings01Values,
  keys: readonly (keyof Settings01Values)[],
) {
  return Object.fromEntries(keys.map((key) => [key, values[key]]))
}

/**
 * 设置页：左侧分区导航（窄屏变成顶部分段选择）+ 右侧当前分区的控制面板 + 底部保存栏。
 * 值同时支持受控与非受控；保存回调返回 Promise，组件管理 loading，回调 throw 的 Error.message 会显示在保存栏上。
 */
function Settings01({
  value: valueProp,
  defaultValue,
  defaults,
  onValueChange,
  section: sectionProp,
  defaultSection = "appearance",
  onSectionChange,
  onSave = demoSave,
  labels,
  className,
}: {
  /** 受控的全部设置值 */
  value?: Settings01Values
  /** 非受控时的初始值，没写的项取 `defaults` */
  defaultValue?: Partial<Settings01Values>
  /** 出厂默认值，逐项覆盖 config.ts 的 DEFAULT_VALUES；「已修改」「恢复默认」都以它为准 */
  defaults?: Partial<Settings01Values>
  /** 任何一项变化时回调，参数是变化后的全部设置 */
  onValueChange?: (value: Settings01Values) => void
  /** 受控的当前分区 */
  section?: Settings01SectionId
  defaultSection?: Settings01SectionId
  onSectionChange?: (section: Settings01SectionId) => void
  /** 点击「保存」时调用；失败时 throw new Error("原因")，原因会显示在保存栏 */
  onSave?: (values: Settings01Values) => Promise<void>
  /** 覆盖默认文案，见 config.ts 的 DEFAULT_LABELS */
  labels?: Partial<Settings01Labels>
  className?: string
}) {
  const text = resolveLabels(labels)
  const reducedMotion = useReducedMotion()
  const resolvedDefaults = useMemo<Settings01Values>(
    () => ({ ...DEFAULT_VALUES, ...defaults }),
    [defaults],
  )
  const [values, setValues] = useControllableState<Settings01Values>({
    prop: valueProp,
    defaultProp: { ...resolvedDefaults, ...defaultValue },
    onChange: onValueChange,
  })
  const [section, setSection] = useControllableState<Settings01SectionId>({
    prop: sectionProp,
    defaultProp: defaultSection,
    onChange: onSectionChange,
  })
  // 上一次保存（或首次载入）时的值：和默认值比出「已修改」，和它比出「有未保存的更改」
  const [saved, setSaved] = useState(values)
  const action = useSaveAction(text.saveFailed)

  const set: SetValue = (key, next) => {
    setValues((previous) => ({ ...previous, [key]: next }))
    action.reset()
  }
  const modified = (key: keyof Settings01Values) =>
    !isSameValue(values[key], resolvedDefaults[key])
  const counts = Object.fromEntries(
    SECTION_IDS.map((id) => [id, SECTION_KEYS[id].filter(modified).length]),
  ) as Record<Settings01SectionId, number>
  const changes = SECTION_IDS.flatMap((section) => SECTION_KEYS[section].filter(modified).map((key) => ({ key, section })))
  const total = changes.length
  const dirty = (Object.keys(values) as (keyof Settings01Values)[]).some(
    (key) => !isSameValue(values[key], saved[key]),
  )
  const pending = action.status === "pending"

  const resetSection = (id: Settings01SectionId) => {
    setValues((previous) => ({
      ...previous,
      ...pickKeys(resolvedDefaults, SECTION_KEYS[id]),
    }))
    action.reset()
  }
  const resetAll = () => {
    setValues({ ...resolvedDefaults })
    action.reset()
  }
  const save = async () => {
    const snapshot = values
    if (await action.run(() => onSave(snapshot))) setSaved(snapshot)
  }

  const Section = SECTIONS[section]
  const sectionProps: SectionProps = {
    values,
    labels: text,
    set,
    modified,
    count: counts[section],
    onReset: () => resetSection(section),
    getCode: () =>
      JSON.stringify(pickKeys(values, SECTION_KEYS[section]), null, 2),
  }

  return (
    <div
      data-slot="settings-01"
      className={cn(
        "relative flex min-h-svh flex-col bg-background text-foreground",
        className,
      )}
      // 强调色同时作为 --flow-tone，导航的选中标记等跟着它走
      style={flowToneStyle(values.accent)}
    >
      <header className="border-b border-edge">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-4 sm:px-6 lg:border-x lg:border-edge">
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-md border border-edge bg-muted/50"
          >
            <Settings className="size-4" />
          </span>
          <div className="min-w-0">
            <h1 className="text-base leading-tight font-semibold tracking-tight">
              {text.title}
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              {text.description}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col md:flex-row lg:border-x lg:border-edge">
        <SectionNav
          section={section}
          onSectionChange={setSection}
          counts={counts}
          labels={text}
        />
        <SectionTabs
          section={section}
          onSectionChange={setSection}
          labels={text}
          tone={values.accent}
        />
        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={section}
              initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
              transition={{ duration: 0.18 }}
            >
              <Section {...sectionProps} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <footer
        aria-label={text.footerLabel}
        data-slot="settings-01-footer"
        className="sticky bottom-0 z-20 border-t border-edge bg-background/90 backdrop-blur"
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:border-x lg:border-edge">
          <div className="min-w-0 text-sm">
            <Settings01Changes changes={changes} values={values} defaults={resolvedDefaults} labels={text} pending={pending} dirty={dirty} onUndo={(key) => set(key, resolvedDefaults[key])} onReset={resetAll} onSave={save} />
            {/* 状态行固定占一行高度，避免保存时底栏跳动；出错时同一位置换成红色的错误原因 */}
            {action.status === "error" ? (
              <p
                role="alert"
                data-slot="settings-01-error"
                className="min-h-4 truncate text-xs text-destructive"
              >
                {action.error}
              </p>
            ) : (
              <p
                role="status"
                data-slot="settings-01-status"
                className="flex min-h-4 items-center gap-1 truncate text-xs text-muted-foreground"
              >
                {pending ? (
                  text.saving
                ) : action.status === "saved" ? (
                  <>
                    <Check className="size-3.5 shrink-0" />
                    {text.saved}
                  </>
                ) : dirty ? (
                  text.unsaved
                ) : (
                  text.upToDate
                )}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              disabled={total === 0 || pending}
              onClick={resetAll}
            >
              {text.resetAll}
            </Button>
            <Button disabled={!dirty || pending} onClick={save}>
              {pending ? (
                <LoaderCircle className="animate-spin" data-icon="inline-start" />
              ) : null}
              {pending ? text.saving : text.save}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export { Settings01 }
export type { Settings01Labels, Settings01SectionId, Settings01Values }
