"use client"

import { Eye, EyeOff, Loader2, type LucideIcon } from "lucide-react"
import { useState, type ComponentProps, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

import { resolveLabels, type Auth01Labels } from "./config"

/** 带图标、错误提示的输入框；错误通过 aria-describedby 关联，读屏会一并读出。 */
function TextField({
  id,
  label,
  icon: Icon,
  error,
  labelAction,
  trailing,
  adjacent,
  className,
  ...props
}: Omit<ComponentProps<typeof Input>, "id"> & {
  id: string
  label: string
  icon: LucideIcon
  error?: string
  /** 标签行右侧的操作，例如「忘记密码？」 */
  labelAction?: ReactNode
  /** 输入框内右侧的元素，例如显示/隐藏密码按钮 */
  trailing?: ReactNode
  /** 输入框外右侧的元素，例如「获取验证码」按钮 */
  adjacent?: ReactNode
}) {
  const errorId = `${id}-error`
  return (
    <div data-slot="auth-01-text-field" className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        {labelAction}
      </div>
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Icon
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id={id}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn("h-9 pl-9", trailing && "pr-10", className)}
            {...props}
          />
          {trailing}
        </div>
        {adjacent}
      </div>
      {error ? (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
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
          className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
