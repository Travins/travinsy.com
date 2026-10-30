"use client"

import * as React from "react"
import { Switch } from "@base-ui/react/switch"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { flowToneStyle, type FlowTone } from "@/registry/lib/flow-tone"

/**
 * 整条方条都是开关：左侧标签，右侧一个胶囊轨道和圆形手柄。
 * 打开时整条从左往右铺上淡色，轨道变成实色，手柄滑到右端。
 * 高度表与数值滑块一致（bar 28 / 32 / 36px，compact 18 / 22 / 24px）。
 */
const toggleSwitchVariants = cva(
  "group/toggle-switch relative flex h-(--toggle-switch-height) w-full min-w-0 cursor-pointer items-center justify-between gap-3 overflow-hidden rounded-md border border-edge bg-muted/60 px-3 text-start text-muted-foreground outline-none select-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-[checked]:text-foreground data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
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
      {
        variant: "bar",
        size: "sm",
        class:
          "[--toggle-switch-height:1.75rem] pointer-coarse:[--toggle-switch-height:2.25rem] [--toggle-switch-knob:0.75rem]",
      },
      {
        variant: "bar",
        size: "default",
        class:
          "[--toggle-switch-height:2rem] pointer-coarse:[--toggle-switch-height:2.5rem] [--toggle-switch-knob:0.875rem]",
      },
      {
        variant: "bar",
        size: "lg",
        class:
          "[--toggle-switch-height:2.25rem] pointer-coarse:[--toggle-switch-height:2.75rem] [--toggle-switch-knob:1rem]",
      },
      {
        variant: "compact",
        size: "sm",
        class:
          "[--toggle-switch-height:1.125rem] [--toggle-switch-knob:0.5rem]",
      },
      {
        variant: "compact",
        size: "default",
        class:
          "[--toggle-switch-height:1.375rem] [--toggle-switch-knob:0.625rem]",
      },
      {
        variant: "compact",
        size: "lg",
        class: "[--toggle-switch-height:1.5rem] [--toggle-switch-knob:0.75rem]",
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
      {/* 胶囊轨道 + 圆形手柄：最容易一眼读懂的开关形态；打开时轨道换成实色，手柄滑到另一端 */}
      <span
        aria-hidden="true"
        data-slot="toggle-switch-track"
        className={cn(
          "relative flex h-[calc(var(--toggle-switch-knob)+4px)] w-[calc(var(--toggle-switch-knob)*2+4px)] shrink-0 items-center rounded-full bg-foreground/15 p-0.5 transition-colors duration-200 motion-reduce:transition-none dark:bg-foreground/20",
          hasTone
            ? "group-data-[checked]/toggle-switch:bg-(--flow-tone)"
            : "group-data-[checked]/toggle-switch:bg-foreground",
        )}
      >
        <Switch.Thumb
          data-slot="toggle-switch-thumb"
          className="size-(--toggle-switch-knob) rounded-full bg-background shadow-sm transition-transform duration-200 ease-out data-[checked]:translate-x-(--toggle-switch-knob) motion-reduce:transition-none rtl:data-[checked]:-translate-x-(--toggle-switch-knob)"
        />
      </span>
    </Switch.Root>
  )
}

export { ToggleSwitch, toggleSwitchVariants }
export type { ToggleSwitchProps, ToggleSwitchSize, ToggleSwitchVariant }
