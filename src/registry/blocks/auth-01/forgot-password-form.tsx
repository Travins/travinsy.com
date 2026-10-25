"use client"

import { Mail, MailCheck } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"

import {
  FormError,
  SubmitButton,
  TextField,
  ViewHeading,
} from "./form-parts"
import { forgotPasswordSchema } from "./schemas"
import { useAuthForm } from "./use-auth-form"

export function ForgotPasswordForm({
  onForgotPassword,
  onSwitchToSignIn,
}: {
  onForgotPassword: (email: string) => Promise<void>
  onSwitchToSignIn: () => void
}) {
  const form = useAuthForm(forgotPasswordSchema, { email: "" })
  const [sentTo, setSentTo] = useState<string | null>(null)

  if (sentTo) {
    return (
      <div className="flex flex-col items-center gap-4 text-center" role="status">
        <span
          aria-hidden="true"
          className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary [&_svg]:size-7"
        >
          <MailCheck />
        </span>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">邮件已发送</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            我们已向 <span className="font-medium text-foreground">{sentTo}</span>{" "}
            发送了重置密码的链接，请查收邮件。没收到？请检查垃圾邮件箱。
          </p>
        </div>
        <Button className="h-10 w-full" onClick={onSwitchToSignIn}>
          返回登录
        </Button>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-5">
      <ViewHeading
        title="找回密码"
        description="输入注册时使用的邮箱，我们会发送重置链接"
      />
      <form
        noValidate
        onSubmit={form.handleSubmit(async ({ email }) => {
          await onForgotPassword(email.trim())
          setSentTo(email.trim())
        })}
        className="flex flex-col gap-5"
      >
        <FormError message={form.formError} />
        <TextField
          id="forgot-email"
          label="邮箱"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          value={form.values.email}
          error={form.errors.email}
          onChange={(event) => form.setValue("email", event.target.value)}
          onBlur={() => form.blur("email")}
        />
        <SubmitButton pending={form.pending} pendingText="发送中…">
          发送重置链接
        </SubmitButton>
      </form>
      <Button variant="ghost" className="h-10" onClick={onSwitchToSignIn}>
        返回登录
      </Button>
    </div>
  )
}
