"use client"

import { useSyncExternalStore } from "react"
import { ArrowRight, Undo2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Item, ItemContent, ItemTitle, ItemDescription, ItemGroup } from "@/components/ui/item"
import { Popover, PopoverTrigger, PopoverContent, PopoverTitle } from "@/components/ui/popover"
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { flowToneStyle } from "@/registry/lib/flow-tone"

import { SECTION_LABEL_KEYS, formatLabel, type Settings01Labels } from "./config"
import type { Settings01SectionId, Settings01Values } from "./types"
import { formatHour } from "./utils"

function subscribe(callback: () => void) {
  const media = window.matchMedia("(max-width: 767px)")
  media.addEventListener("change", callback)
  return () => media.removeEventListener("change", callback)
}

/** 所有字段的对比读数在这里统一格式化。 */
function formatSetting(key: keyof Settings01Values, value: Settings01Values[keyof Settings01Values], labels: Settings01Labels): string {
  if (typeof value === "boolean") return value ? labels.valueOn : labels.valueOff
  if (Array.isArray(value)) return value.map((hour) => formatHour(hour)).join(" – ")
  if (key === "fontSize" || key === "radius") return formatLabel(labels.readoutPx, { value: String(value) })
  if (key === "retention") return formatLabel(labels.readoutDays, { value: String(value) })
  if (key === "volume") return `${value}%`
  const options: Partial<Record<keyof Settings01Values, Record<string, string>>> = {
    theme: { light: labels.themeLight, dark: labels.themeDark, system: labels.themeSystem },
    density: { compact: labels.densityCompact, comfortable: labels.densityComfortable, spacious: labels.densitySpacious },
    soundTheme: { soft: labels.soundSoft, crisp: labels.soundCrisp, mechanical: labels.soundMechanical },
    indent: { "2": labels.indentTwo, "4": labels.indentFour, tab: labels.indentTab },
    visibility: { public: labels.visibilityPublic, team: labels.visibilityTeam, private: labels.visibilityPrivate },
  }
  return options[key]?.[String(value)] ?? String(value)
}

function Settings01Changes({ changes, values, defaults, labels, pending, dirty, onUndo, onReset, onSave }: {
  changes: { key: keyof Settings01Values; section: Settings01SectionId }[]
  values: Settings01Values
  defaults: Settings01Values
  labels: Settings01Labels
  pending: boolean
  dirty: boolean
  onUndo: (key: keyof Settings01Values) => void
  onReset: () => void
  onSave: () => void
}) {
  const mobile = useSyncExternalStore(subscribe, () => window.matchMedia("(max-width: 767px)").matches, () => false)
  const trigger = <Button variant="ghost" disabled={!changes.length || pending} className="max-w-full justify-start px-0 tabular-nums">{changes.length ? formatLabel(labels.modifiedCount, { count: changes.length }) : labels.unmodified}</Button>
  const content = (
    <div data-slot="settings-01-changes" className="min-w-0">
      <ItemGroup className="max-h-[55svh] gap-0 overflow-y-auto">
        {changes.map(({ key, section }) => (
          <Item key={key} role="listitem" size="xs" className="flex-nowrap gap-2 px-0">
            <ItemContent className="min-w-0">
              <ItemTitle>{labels[key]}</ItemTitle>
              <ItemDescription className="text-xs">{labels[SECTION_LABEL_KEYS[section].title]}</ItemDescription>
            </ItemContent>
            <div className="flex min-w-0 flex-wrap items-center justify-end gap-1 text-xs">
              <span className="inline-flex items-center gap-1 text-muted-foreground line-through">
                {key === "accent" && <span aria-hidden className="size-2.5 rounded-sm bg-(--flow-tone)" style={flowToneStyle(String(defaults[key]))} />}
                {formatSetting(key, defaults[key], labels)}
              </span>
              <ArrowRight aria-hidden className="size-3 shrink-0 text-muted-foreground" />
              <span className="inline-flex items-center gap-1 font-medium text-foreground">
                {key === "accent" && <span aria-hidden className="size-2.5 rounded-sm bg-(--flow-tone)" style={flowToneStyle(String(values[key]))} />}
                {formatSetting(key, values[key], labels)}
              </span>
            </div>
            {/* 行内次要操作使用 icon-sm；底部主操作统一 default。 */}
            <Button variant="ghost" size="icon-sm" disabled={pending} aria-label={formatLabel(labels.undoChange, { field: labels[key] })} onClick={() => onUndo(key)}><Undo2 aria-hidden /></Button>
          </Item>
        ))}
      </ItemGroup>
      <div className="mt-3 flex justify-end gap-2 border-t border-edge pt-3">
        <Button variant="outline" disabled={!changes.length || pending} onClick={onReset}>{labels.resetChanges}</Button>
        <Button disabled={!dirty || pending} onClick={onSave}>{pending ? labels.saving : labels.save}</Button>
      </div>
    </div>
  )
  return mobile ? (
    <Sheet>
      <SheetTrigger render={trigger} />
      <SheetContent side="bottom" className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <SheetTitle>{labels.changesTitle}</SheetTitle>
        {content}
      </SheetContent>
    </Sheet>
  ) : (
    <Popover>
      <PopoverTrigger render={trigger} />
      <PopoverContent side="top" align="start" className="w-88 max-w-[calc(100vw-2rem)] p-4">
        <PopoverTitle>{labels.changesTitle}</PopoverTitle>
        {content}
      </PopoverContent>
    </Popover>
  )
}

export { Settings01Changes }
