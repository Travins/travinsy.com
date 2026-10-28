"use client"

import { KeyRound, Lock, Smartphone, User } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { SegmentedControl } from "@/registry/ui/segmented-control/segmented-control"
import { ToggleSwitch } from "@/registry/ui/toggle-switch/toggle-switch"

import { formatLabel, resolveLabels, type Auth01Labels } from "./config"
import {
  FormError,
  LinkButton,
  PasswordField,
  SubmitButton,
  TextField,
  ViewHeading,
} from "./form-parts"
import { createCodeSignInSchema, createSignInSchema } from "./schemas"
import { SocialButtons, type SocialProvider } from "./social-buttons"
import { useAsyncAction, useAuthForm } from "./use-auth-form"

type SignInValues =
  | { method: "password"; account: string; password: string; remember: boolean }
  | { method: "code"; phone: string; code: string }

type SignInMethod = SignInValues["method"]

const CODE_COOLDOWN = 60

function PasswordSignIn({
  onSignIn,
  onForgotPassword,
  labels,
}: {
  onSignIn: (values: SignInValues) => Promise<void>
  onForgotPassword: () => void
  labels?: Partial<Auth01Labels>
}) {
  // labels 引用不变时 text 与 schema 都不重建，避免每次输入都重新编译 zod schema
  const text = useMemo(() => resolveLabels(labels), [labels])
  const schema = useMemo(() => createSignInSchema(text), [text])
  const form = useAuthForm(
    schema,
    { account: "", password: "", remember: false },
    { fallbackError: text.requestFailed },
  )
  return (
    <form
      data-slot="auth-01-sign-in-password"
      noValidate
      onSubmit={form.handleSubmit((values) =>
        onSignIn({ method: "password", ...values }),
      )}
      className="flex flex-col gap-5"
    >
      <FormError message={form.formError} />
      <TextField
        id="sign-in-account"
        label={text.accountLabel}
        icon={User}
        autoComplete="username"
        placeholder={text.accountPlaceholder}
        value={form.values.account}
        error={form.errors.account}
        onChange={(event) => form.setValue("account", event.target.value)}
        onBlur={() => form.blur("account")}
      />
      <PasswordField
        id="sign-in-password"
        label={text.passwordLabel}
        icon={Lock}
        autoComplete="current-password"
        placeholder={text.passwordPlaceholder}
        value={form.values.password}
        error={form.errors.password}
        onChange={(event) => form.setValue("password", event.target.value)}
        onBlur={() => form.blur("password")}
        labels={labels}
        labelAction={
          <LinkButton className="text-xs" onClick={onForgotPassword}>
            {text.forgotPassword}
          </LinkButton>
        }
      />
      {/* 记住登录状态是即时生效的开关，不是需要同意的声明，所以用开关而不是复选框 */}
      <ToggleSwitch
        label={text.remember}
        tone="primary"
        checked={form.values.remember}
        onCheckedChange={(checked) => form.setValue("remember", checked)}
      />
      <SubmitButton pending={form.pending} pendingText={text.signInPending}>
        {text.signInSubmit}
      </SubmitButton>
    </form>
  )
}

function CodeSignIn({
  onSignIn,
  onSendCode,
  labels,
}: {
  onSignIn: (values: SignInValues) => Promise<void>
  onSendCode: (phone: string) => Promise<void>
  labels?: Partial<Auth01Labels>
}) {
  const text = useMemo(() => resolveLabels(labels), [labels])
  const schema = useMemo(() => createCodeSignInSchema(text), [text])
  const form = useAuthForm(
    schema,
    { phone: "", code: "" },
    { fallbackError: text.requestFailed },
  )
  const sender = useAsyncAction(text.requestFailed)
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    if (seconds <= 0) return
    const timer = window.setTimeout(
      () => setSeconds((value) => value - 1),
      1000,
    )
    return () => window.clearTimeout(timer)
  }, [seconds])

  const sendCode = async () => {
    if (!form.validateField("phone")) return
    const sent = await sender.run(() => onSendCode(form.values.phone.trim()))
    if (sent) setSeconds(CODE_COOLDOWN)
  }
  return (
    <form
      data-slot="auth-01-sign-in-code"
      noValidate
      onSubmit={form.handleSubmit((values) =>
        onSignIn({ method: "code", ...values }),
      )}
      className="flex flex-col gap-5"
    >
      <FormError message={form.formError ?? sender.error} />
      <TextField
        id="sign-in-phone"
        label={text.phoneLabel}
        icon={Smartphone}
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        placeholder={text.phonePlaceholder}
        value={form.values.phone}
        error={form.errors.phone}
        onChange={(event) => form.setValue("phone", event.target.value)}
        onBlur={() => form.blur("phone")}
      />
      <TextField
        id="sign-in-code"
        label={text.codeLabel}
        icon={KeyRound}
        inputMode="numeric"
        maxLength={6}
        autoComplete="one-time-code"
        placeholder={text.codePlaceholder}
        value={form.values.code}
        error={form.errors.code}
        onChange={(event) => form.setValue("code", event.target.value)}
        onBlur={() => form.blur("code")}
        adjacent={
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-28 shrink-0 tabular-nums"
            disabled={sender.pending || seconds > 0}
            onClick={sendCode}
          >
            {sender.pending
              ? text.sendCodePending
              : seconds > 0
                ? formatLabel(text.resendCode, { seconds })
                : text.sendCode}
          </Button>
        }
      />
      <SubmitButton pending={form.pending} pendingText={text.signInPending}>
        {text.signInSubmit}
      </SubmitButton>
    </form>
  )
}

function SignInForm({
  socialProviders,
  allowSignUp,
  onSignIn,
  onSendCode,
  onSocialSignIn,
  onForgotPassword,
  onSwitchToSignUp,
  labels,
}: {
  socialProviders: readonly SocialProvider[]
  allowSignUp: boolean
  onSignIn: (values: SignInValues) => Promise<void>
  onSendCode: (phone: string) => Promise<void>
  onSocialSignIn: (provider: SocialProvider) => Promise<void>
  onForgotPassword: () => void
  onSwitchToSignUp: () => void
  labels?: Partial<Auth01Labels>
}) {
  const text = resolveLabels(labels)
  const [method, setMethod] = useState<SignInMethod>("password")
  const methodOptions = [
    { value: "password", label: text.signInPasswordTab },
    { value: "code", label: text.signInCodeTab },
  ] as const
  const social = useAsyncAction(text.requestFailed)
  return (
    <div data-slot="auth-01-sign-in" className="flex flex-col gap-5">
      <ViewHeading
        title={text.signInTitle}
        description={text.signInDescription}
      />
      <div className="flex flex-col gap-3">
        <SegmentedControl
          aria-label={text.signInMethodLabel}
          size="lg"
          options={methodOptions}
          value={method}
          onValueChange={(value) => setMethod(value as SignInMethod)}
        />
        {method === "password" ? (
          <PasswordSignIn
            onSignIn={onSignIn}
            onForgotPassword={onForgotPassword}
            labels={labels}
          />
        ) : (
          <CodeSignIn
            onSignIn={onSignIn}
            onSendCode={onSendCode}
            labels={labels}
          />
        )}
      </div>
      {socialProviders.length > 0 && (
        <>
          <div
            role="separator"
            className="flex items-center gap-3 text-xs text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border"
          >
            {text.socialDivider}
          </div>
          <FormError message={social.error} />
          <SocialButtons
            providers={socialProviders}
            pending={social.pending}
            onSelect={(provider) => social.run(() => onSocialSignIn(provider))}
          />
        </>
      )}
      {allowSignUp && (
        <p className="text-center text-sm text-muted-foreground">
          {text.noAccount}{" "}
          <LinkButton onClick={onSwitchToSignUp}>{text.signUpLink}</LinkButton>
        </p>
      )}
    </div>
  )
}

export { SignInForm }
export type { SignInValues }
