"use client"

import { Mail, MailCheck } from "lucide-react"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Ripple } from "@/registry/ui/ripple/ripple"

import { resolveLabels, splitLabel, type Auth01Labels } from "./config"
import { FormError, SubmitButton, TextField, ViewHeading } from "./form-parts"
import { createForgotPasswordSchema } from "./schemas"
import { useAuthForm } from "./use-auth-form"

function ForgotPasswordForm({
  onForgotPassword,
  onSwitchToSignIn,
  labels,
}: {
  onForgotPassword: (email: string) => Promise<void>
  onSwitchToSignIn: () => void
  labels?: Partial<Auth01Labels>
}) {
  // labels 引用不变时 text 与 schema 都不重建，避免每次输入都重新编译 zod schema
  const text = useMemo(() => resolveLabels(labels), [labels])
  const schema = useMemo(() => createForgotPasswordSchema(text), [text])
  const form = useAuthForm(
    schema,
    { email: "" },
    { fallbackError: text.requestFailed },
  )
  const [sentTo, setSentTo] = useState<string | null>(null)

  if (sentTo) {
    const [before, after] = splitLabel(text.emailSentDescription, "email")
    return (
      <div
        data-slot="auth-01-email-sent"
        className="flex flex-col items-center gap-4 text-center"
        role="status"
      >
        {/* 以邮件图标为圆心向外扩散的波纹，表达「已发出」；纯装饰，状态由下方文字播报 */}
        <Ripple
          size={192}
          rings={3}
          ringGap={44}
          baseSize={56}
          duration={3.5}
          background="none"
          tone="primary"
          className="h-48 w-48 max-w-full"
        >
          <span className="absolute top-1/2 left-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-edge bg-background text-primary [&_svg]:size-7">
            <MailCheck />
          </span>
        </Ripple>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {text.emailSentTitle}
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            {before}
            <span className="font-medium text-foreground">{sentTo}</span>
            {after}
          </p>
        </div>
        <Button className="h-10 w-full" onClick={onSwitchToSignIn}>
          {text.backToSignIn}
        </Button>
      </div>
    )
  }
  return (
    <div data-slot="auth-01-forgot-password" className="flex flex-col gap-5">
      <ViewHeading
        title={text.forgotPasswordTitle}
        description={text.forgotPasswordDescription}
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
          label={text.emailLabel}
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder={text.emailPlaceholder}
          value={form.values.email}
          error={form.errors.email}
          onChange={(event) => form.setValue("email", event.target.value)}
          onBlur={() => form.blur("email")}
        />
        <SubmitButton
          pending={form.pending}
          pendingText={text.sendResetLinkPending}
        >
          {text.sendResetLink}
        </SubmitButton>
      </form>
      <Button variant="ghost" className="h-10" onClick={onSwitchToSignIn}>
        {text.backToSignIn}
      </Button>
    </div>
  )
}

export { ForgotPasswordForm }
