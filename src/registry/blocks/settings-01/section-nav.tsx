import type * as React from "react"
import { Bell, Code, Palette, ShieldCheck, Volume2 } from "lucide-react"

import { SegmentedControl } from "@/registry/ui/segmented-control/segmented-control"

import {
  SECTION_IDS,
  SECTION_LABEL_KEYS,
  formatLabel,
  type Settings01Labels,
} from "./config"
import type { Settings01SectionId } from "./types"

const SECTION_ICONS: Record<
  Settings01SectionId,
  React.ComponentType<{ className?: string }>
> = {
  appearance: Palette,
  notifications: Bell,
  sound: Volume2,
  editor: Code,
  privacy: ShieldCheck,
}

/** 宽屏左侧的分区导航：一行一个分区，右侧小圆标显示该分区已修改的项数。 */
function SectionNav({
  section,
  onSectionChange,
  counts,
  labels,
}: {
  section: Settings01SectionId
  onSectionChange: (section: Settings01SectionId) => void
  counts: Record<Settings01SectionId, number>
  labels: Settings01Labels
}) {
  return (
    <nav
      aria-label={labels.navLabel}
      data-slot="settings-01-nav"
      className="hidden w-52 shrink-0 flex-col border-r border-edge md:flex"
    >
      {SECTION_IDS.map((id) => {
        const Icon = SECTION_ICONS[id]
        const active = id === section
        const count = counts[id]
        return (
          <button
            key={id}
            type="button"
            aria-current={active ? "page" : undefined}
            data-slot="settings-01-nav-item"
            onClick={() => onSectionChange(id)}
            className="relative flex h-10 w-full shrink-0 cursor-pointer items-center gap-2.5 border-b border-edge px-4 text-start text-sm text-muted-foreground outline-none transition-colors before:absolute before:inset-y-0 before:left-0 before:w-0.5 hover:bg-muted/50 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset aria-[current=page]:bg-muted/60 aria-[current=page]:font-medium aria-[current=page]:text-foreground aria-[current=page]:before:bg-(--flow-tone)"
          >
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{labels[SECTION_LABEL_KEYS[id].title]}</span>
            {count > 0 ? (
              <span
                data-slot="settings-01-nav-count"
                title={formatLabel(labels.navSectionModified, { count })}
                className="ms-auto min-w-5 rounded-full bg-foreground/10 px-1.5 text-center text-[11px] leading-5 text-foreground tabular-nums"
              >
                {count}
                <span className="sr-only">
                  {formatLabel(labels.navSectionModified, { count })}
                </span>
              </span>
            ) : null}
          </button>
        )
      })}
    </nav>
  )
}

/** 窄屏顶部的分段选择：用短名，五项刚好排进 375px。 */
function SectionTabs({
  section,
  onSectionChange,
  labels,
  tone,
}: {
  section: Settings01SectionId
  onSectionChange: (section: Settings01SectionId) => void
  labels: Settings01Labels
  tone: string
}) {
  return (
    <div
      data-slot="settings-01-tabs"
      className="border-b border-edge p-4 sm:px-6 md:hidden"
    >
      <SegmentedControl
        aria-label={labels.navLabel}
        tone={tone}
        value={section}
        onValueChange={(next) => onSectionChange(next as Settings01SectionId)}
        options={SECTION_IDS.map((id) => ({
          value: id,
          label: labels[SECTION_LABEL_KEYS[id].nav],
        }))}
      />
    </div>
  )
}

export { SectionNav, SectionTabs }
