"use client"

import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useState, type ComponentProps, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { resolveLabels, type Auth01Labels } from "./config"

/**
 * 方条输入框：标签在条内左侧，值靠右；错误文字在条下方，通过 aria-describedby 关联，读屏会一并读出。
 * 高度取 lg 档（36px，触屏 44px），与区块里 size="lg" 的按钮等高。
 */
function TextField({
  id,
  label,
  error,
  footerAction,
  trailing,
  className,
  ...props
}: Omit<ComponentProps<"input">, "id"> & {
  id: string
  label: string
  error?: string
  /** 条下方右侧的操作，例如「忘记密码？」；有错误文字时错误在左、操作在右 */
  footerAction?: ReactNode
  /** 条内最右侧的元素，例如显示/隐藏密码按钮 */
  trailing?: ReactNode
}) {
  const errorId = `${id}-error`
  return (
    <div data-slot="auth-01-text-field" className="flex flex-col gap-1.5">
      <div
        data-slot="auth-01-text-field-control"
        className={cn(
          "flex h-9 w-full min-w-0 cursor-text items-center gap-3 rounded-md border bg-muted/60 px-3 text-base transition-colors pointer-coarse:h-11 md:text-sm has-disabled:cursor-not-allowed has-disabled:opacity-50",
          error
            ? "border-destructive ring-3 ring-destructive/20 dark:border-destructive/50 dark:ring-destructive/40"
            : "border-edge focus-within:ring-3 focus-within:ring-ring/50 hover:bg-muted",
        )}
        // 点到条内空白处（标签与值之间）也聚焦输入框
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            event.preventDefault()
            event.currentTarget.querySelector("input")?.focus()
          }
        }}
      >
        <label
          htmlFor={id}
          className="shrink-0 text-muted-foreground max-md:text-sm"
        >
          {label}
        </label>
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent text-right font-medium outline-none placeholder:font-normal placeholder:text-muted-foreground disabled:cursor-not-allowed",
            className,
          )}
          {...props}
        />
        {trailing}
      </div>
      {error || footerAction ? (
        <div className="flex items-start justify-between gap-3">
          {error ? (
            <p id={errorId} className="text-xs text-destructive">
              {error}
            </p>
          ) : (
            <span />
          )}
          {footerAction}
        </div>
      ) : null}
    </div>
  )
}

/** 带显示/隐藏切换的密码框。 */
function PasswordField({
  labels,
  ...props
}: Omit<ComponentProps<typeof TextField>, "type" | "trailing"> & {
  labels?: Partial<Auth01Labels>
}) {
  const text = resolveLabels(labels)
  const [visible, setVisible] = useState(false)
  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      trailing={
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? text.hidePassword : text.showPassword}
          aria-pressed={visible}
          // 按钮比条内边距大，向右让出 8px，图标视觉上仍与条的右缘留足间距
          className="-mr-2 shrink-0 text-muted-foreground hover:text-foreground"
        >
          {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
        </Button>
      }
    />
  )
}

/** 表单级错误（接口返回的失败原因等），出现时读屏会立即朗读。 */
function FormError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p
      data-slot="auth-01-form-error"
      role="alert"
      className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
      {message}
    </p>
  )
}

/** 提交按钮：pending 时显示转圈并禁用。 */
function SubmitButton({
  pending,
  pendingText,
  children,
}: {
  pending: boolean
  pendingText: string
  children: ReactNode
}) {
  return (
    <Button
      data-slot="auth-01-submit-button"
      type="submit"
      size="lg"
      className="w-full"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 aria-hidden="true" className="animate-spin" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </Button>
  )
}

/** 视图头部：标题 + 说明。每个视图只有一个 h1。 */
function ViewHeading({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div data-slot="auth-01-view-heading" className="flex flex-col gap-1">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

/** 文字链接样式的按钮，用于视图切换。 */
function LinkButton({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      data-slot="auth-01-link-button"
      type="button"
      className={cn(
        "rounded-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...props}
    />
  )
}

export { FormError, LinkButton, PasswordField, SubmitButton, TextField, ViewHeading }
