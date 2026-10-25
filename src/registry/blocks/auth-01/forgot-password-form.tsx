"use client"

import { Mail, MailCheck } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"

import { resolveLabels, splitLabel, type Auth01Labels } from "./config"
import { FormError, SubmitButton, TextField, ViewHeading } from "./form-parts"
import { forgotPasswordSchema } from "./schemas"
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
  const text = resolveLabels(labels)
  const form = useAuthForm(
    forgotPasswordSchema,
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
        <span
          aria-hidden="true"
          className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary [&_svg]:size-7"
        >
          <MailCheck />
        </span>
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
