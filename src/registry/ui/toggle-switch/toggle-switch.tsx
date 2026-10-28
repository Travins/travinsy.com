"use client"

import * as React from "react"
import { Switch } from "@base-ui/react/switch"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { flowToneStyle, type FlowTone } from "@/registry/ui/flow-diagram/tone"

/**
 * 整条方条都是开关：左侧标签，右侧一段小轨道和一根竖线手柄（与数值滑块的手柄同形）。
 * 打开时整条从左往右铺上淡色，手柄滑到右端并变成实色。
 * 高度表与数值滑块一致（bar 28 / 32 / 36px，compact 18 / 22 / 24px）。
 */
const toggleSwitchVariants = cva(
  "group/toggle-switch relative flex h-(--toggle-switch-height) w-full min-w-0 cursor-pointer items-center justify-between gap-3 overflow-hidden rounded-md border border-edge bg-muted/60 px-3 text-start text-muted-foreground outline-none select-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-[checked]:text-foreground data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
  {
    variants: {
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-sm",
      },
      variant: {
        bar: "",
        compact: "text-xs",
      },
    },
    compoundVariants: [
      { variant: "bar", size: "sm", class: "[--toggle-switch-height:1.75rem]" },
      {
        variant: "bar",
        size: "default",
        class: "[--toggle-switch-height:2rem]",
      },
      { variant: "bar", size: "lg", class: "[--toggle-switch-height:2.25rem]" },
      {
        variant: "compact",
        size: "sm",
        class: "[--toggle-switch-height:1.125rem]",
      },
      {
        variant: "compact",
        size: "default",
        class: "[--toggle-switch-height:1.375rem]",
      },
      {
        variant: "compact",
        size: "lg",
        class: "[--toggle-switch-height:1.5rem]",
      },
    ],
    defaultVariants: {
      size: "default",
      variant: "bar",
    },
  },
)

type ToggleSwitchSize = "sm" | "default" | "lg"
type ToggleSwitchVariant = "bar" | "compact"

type ToggleSwitchProps = Omit<
  Switch.Root.Props,
  "render" | "nativeButton" | "children"
> & {
  /** 标签，也是开关的可访问名称 */
  label: React.ReactNode
  /** 标签右侧的补充说明（如当前状态「已开启」）；不传时不显示 */
  description?: React.ReactNode
  /**
   * 高度档：`bar` 与数值滑块默认同高，`compact` 是面板里用的中等高度
   * @default "bar"
   */
  variant?: ToggleSwitchVariant
  /**
   * 尺寸档
   * @default "default"
   */
  size?: ToggleSwitchSize
  /** 色调：打开时的铺色与手柄取 `--flow-tone`；不传时用前景色 */
  tone?: FlowTone
  /**
   * 标记为「已改动」：标签改用前景色，根元素带 `data-modified`
   * @default false
   */
  modified?: boolean
}

/** 方条开关：基于 Base UI Switch，渲染为原生 `button`，带 `role="switch"`。 */
function ToggleSwitch({
  label,
  description,
  variant = "bar",
  size = "default",
  tone,
  modified = false,
  className,
  style,
  ...props
}: ToggleSwitchProps) {
  const hasTone = tone !== undefined

  return (
    <Switch.Root
      {...props}
      nativeButton
      render={<button type="button" />}
      data-slot="toggle-switch"
      data-variant={variant}
      data-modified={modified ? "" : undefined}
      className={cn(
        toggleSwitchVariants({ size, variant }),
        "data-[modified]:text-foreground",
        className,
      )}
      style={{ ...flowToneStyle(tone), ...style }}
    >
      {/* 打开时的铺色：从左往右展开，和滑块的已选填充同一种淡色 */}
      <span
        aria-hidden="true"
        data-slot="toggle-switch-fill"
        className={cn(
          "absolute inset-0 origin-left scale-x-0 transition-transform duration-200 ease-out group-data-[checked]/toggle-switch:scale-x-100 motion-reduce:transition-none rtl:origin-right",
          hasTone
            ? "bg-(--flow-tone)/15 dark:bg-(--flow-tone)/25"
            : "bg-foreground/5 dark:bg-foreground/10",
        )}
      />
      <span
        data-slot="toggle-switch-label"
        className="relative flex min-w-0 items-baseline gap-2 font-medium"
      >
        <span className="truncate">{label}</span>
        {description !== undefined ? (
          <span
            data-slot="toggle-switch-description"
            className="truncate font-normal text-muted-foreground"
          >
            {description}
          </span>
        ) : null}
      </span>
      {/* 小轨道：高度取方条的一半，竖线手柄从左端滑到右端 */}
      <span
        aria-hidden="true"
        data-slot="toggle-switch-track"
        className="relative h-1/2 w-7 shrink-0 rounded-sm border border-edge bg-background/60"
      >
        <Switch.Thumb
          data-slot="toggle-switch-thumb"
          className={cn(
            "absolute inset-y-[-3px] start-0.5 w-1 rounded-full opacity-40 transition-[translate,opacity] duration-200 ease-out data-[checked]:translate-x-4.5 data-[checked]:opacity-100 motion-reduce:transition-none rtl:data-[checked]:-translate-x-4.5",
            hasTone ? "bg-(--flow-tone)" : "bg-foreground",
          )}
        />
      </span>
    </Switch.Root>
  )
}

export { ToggleSwitch, toggleSwitchVariants }
export type { ToggleSwitchProps, ToggleSwitchSize, ToggleSwitchVariant }
