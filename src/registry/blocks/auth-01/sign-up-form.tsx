"use client"

import { Lock, Mail, User } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

import { resolveLabels, type Auth01Labels } from "./config"
import {
  FormError,
  LinkButton,
  PasswordField,
  SubmitButton,
  TextField,
  ViewHeading,
} from "./form-parts"
import { PasswordStrength } from "./password-strength"
import { signUpSchema } from "./schemas"
import { useAuthForm } from "./use-auth-form"

type SignUpValues = { name: string; email: string; password: string }

function SignUpForm({
  termsHref,
  privacyHref,
  onSignUp,
  onSwitchToSignIn,
  labels,
}: {
  termsHref: string
  privacyHref: string
  onSignUp: (values: SignUpValues) => Promise<void>
  onSwitchToSignIn: () => void
  labels?: Partial<Auth01Labels>
}) {
  const text = resolveLabels(labels)
  const form = useAuthForm(
    signUpSchema,
    {
      name: "",
      email: "",
      password: "",
      confirm: "",
      terms: false,
    },
    { fallbackError: text.requestFailed },
  )
  return (
    <div data-slot="auth-01-sign-up" className="flex flex-col gap-5">
      <ViewHeading title={text.signUpTitle} description={text.signUpDescription} />
      <form
        noValidate
        onSubmit={form.handleSubmit(({ name, email, password }) =>
          onSignUp({ name: name.trim(), email: email.trim(), password }),
        )}
        className="flex flex-col gap-4"
      >
        <FormError message={form.formError} />
        <TextField
          id="sign-up-name"
          label={text.nameLabel}
          icon={User}
          autoComplete="name"
          placeholder={text.namePlaceholder}
          value={form.values.name}
          error={form.errors.name}
          onChange={(event) => form.setValue("name", event.target.value)}
          onBlur={() => form.blur("name")}
        />
        <TextField
          id="sign-up-email"
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
        <div className="flex flex-col gap-2">
          <PasswordField
            id="sign-up-password"
            label={text.passwordLabel}
            icon={Lock}
            autoComplete="new-password"
            placeholder={text.newPasswordPlaceholder}
            value={form.values.password}
            error={form.errors.password}
            onChange={(event) => form.setValue("password", event.target.value)}
            onBlur={() => form.blur("password")}
            labels={labels}
          />
          <PasswordStrength password={form.values.password} labels={labels} />
        </div>
        <PasswordField
          id="sign-up-confirm"
          label={text.confirmPasswordLabel}
          icon={Lock}
          autoComplete="new-password"
          placeholder={text.confirmPasswordPlaceholder}
          value={form.values.confirm}
          error={form.errors.confirm}
          onChange={(event) => form.setValue("confirm", event.target.value)}
          onBlur={() => form.blur("confirm")}
          labels={labels}
        />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="sign-up-terms"
              checked={form.values.terms}
              aria-invalid={form.errors.terms ? true : undefined}
              aria-describedby={form.errors.terms ? "sign-up-terms-error" : undefined}
              onCheckedChange={(checked) =>
                form.setValue("terms", checked === true)
              }
            />
            <Label
              htmlFor="sign-up-terms"
              className="cursor-pointer leading-5 font-normal"
            >
              {text.termsPrefix}
              <a
                href={termsHref}
                className="text-primary underline-offset-4 hover:underline"
              >
                {text.termsOfService}
              </a>
              {text.termsConjunction}
              <a
                href={privacyHref}
                className="text-primary underline-offset-4 hover:underline"
              >
                {text.privacyPolicy}
              </a>
            </Label>
          </div>
          {form.errors.terms ? (
            <p id="sign-up-terms-error" className="text-xs text-destructive">
              {form.errors.terms}
            </p>
          ) : null}
        </div>
        <SubmitButton pending={form.pending} pendingText={text.signUpPending}>
          {text.signUpSubmit}
        </SubmitButton>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        {text.haveAccount}{" "}
        <LinkButton onClick={onSwitchToSignIn}>{text.signInLink}</LinkButton>
      </p>
    </div>
  )
}

export { SignUpForm }
export type { SignUpValues }
