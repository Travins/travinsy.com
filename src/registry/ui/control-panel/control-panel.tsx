"use client"

import * as React from "react"
import { Check, Copy, RotateCcw } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * 控制面板：承载数值滑块、分段选择、开关、色调选择这一套方条控件的容器。
 * 由标题栏（标题 + 操作）和若干分组组成，分组内是等宽网格；复制按钮把当前参数写成 JSX。
 */
function ControlPanel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="control-panel"
      className={cn(
        "flex w-full min-w-0 flex-col rounded-lg border border-edge bg-background text-sm",
        className,
      )}
      {...props}
    />
  )
}

function ControlPanelHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="control-panel-header"
      className={cn(
        "flex h-10 shrink-0 items-center gap-2 border-b border-edge ps-3 pe-1.5",
        className,
      )}
      {...props}
    />
  )
}

function ControlPanelTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="control-panel-title"
      className={cn(
        "truncate text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}

/** 标题栏右侧的操作区，放复制、恢复等图标按钮 */
function ControlPanelActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="control-panel-actions"
      className={cn("ms-auto flex shrink-0 items-center gap-0.5", className)}
      {...props}
    />
  )
}

type ControlPanelGroupProps = React.ComponentProps<"div"> & {
  /** 分组小标题；不传时不显示 */
  title?: React.ReactNode
  /**
   * 宽屏下的列数，窄屏（< 640px）一律单列。子控件用 `sm:col-span-2` 之类跨列
   * @default 1
   */
  columns?: 1 | 2 | 3
}

const COLUMNS = {
  1: "",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
} as const

/** 一组控件：可选的小标题 + 网格。相邻分组之间自动画一条分隔线。 */
function ControlPanelGroup({
  title,
  columns = 1,
  className,
  children,
  ...props
}: ControlPanelGroupProps) {
  const titleId = React.useId()
  return (
    <div
      role="group"
      aria-labelledby={title !== undefined ? titleId : undefined}
      data-slot="control-panel-group"
      className={cn(
        "flex flex-col gap-2.5 px-4 pt-3 pb-4 [[data-slot=control-panel-group]+&]:border-t [[data-slot=control-panel-group]+&]:border-edge",
        className,
      )}
      {...props}
    >
      {title !== undefined ? (
        <span
          id={titleId}
          data-slot="control-panel-group-title"
          className="text-xs text-muted-foreground"
        >
          {title}
        </span>
      ) : null}
      <div
        data-slot="control-panel-grid"
        className={cn("grid gap-x-4 gap-y-3", COLUMNS[columns])}
      >
        {children}
      </div>
    </div>
  )
}

type ControlPanelCopyProps = Omit<
  React.ComponentProps<"button">,
  "onClick" | "children"
> & {
  /** 要复制的文本；传函数时在点击那一刻才求值 */
  code: string | (() => string)
  /**
   * 按钮的可访问名称
   * @default "复制代码"
   */
  label?: string
  /**
   * 复制成功后的提示（读屏会朗读）
   * @default "已复制"
   */
  copiedLabel?: string
}

/** 复制按钮：成功后图标换成对勾 1.5 秒。剪贴板不可用（非安全上下文）时静默失败。 */
function ControlPanelCopy({
  code,
  label = "复制代码",
  copiedLabel = "已复制",
  className,
  ...props
}: ControlPanelCopyProps) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1500)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        typeof code === "function" ? code() : code,
      )
      setCopied(true)
    } catch {
      // 非 https 或用户拒绝授权时拿不到剪贴板，不打断操作
    }
  }

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      data-slot="control-panel-copy"
      data-copied={copied ? "" : undefined}
      onClick={copy}
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon-sm" }),
        "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    >
      {copied ? <Check /> : <Copy />}
      <span aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </button>
  )
}

type ControlPanelResetProps = React.ComponentProps<"button"> & {
  /**
   * 按钮的可访问名称
   * @default "恢复默认"
   */
  label?: string
}

function ControlPanelReset({
  label = "恢复默认",
  className,
  ...props
}: ControlPanelResetProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      data-slot="control-panel-reset"
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon-sm" }),
        "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    >
      <RotateCcw />
    </button>
  )
}

export {
  ControlPanel,
  ControlPanelActions,
  ControlPanelCopy,
  ControlPanelGroup,
  ControlPanelHeader,
  ControlPanelReset,
  ControlPanelTitle,
}
export type {
  ControlPanelCopyProps,
  ControlPanelGroupProps,
  ControlPanelResetProps,
}
export { formatJsx } from "./format-jsx"
export type { FormatJsxOptions } from "./format-jsx"
