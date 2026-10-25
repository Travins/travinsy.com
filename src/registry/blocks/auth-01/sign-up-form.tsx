"use client"

import { Lock, Mail, User } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

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

export type SignUpValues = { name: string; email: string; password: string }

export function SignUpForm({
  termsHref,
  privacyHref,
  onSignUp,
  onSwitchToSignIn,
}: {
  termsHref: string
  privacyHref: string
  onSignUp: (values: SignUpValues) => Promise<void>
  onSwitchToSignIn: () => void
}) {
  const form = useAuthForm(signUpSchema, {
    name: "",
    email: "",
    password: "",
    confirm: "",
    terms: false,
  })
  return (
    <div className="flex flex-col gap-5">
      <ViewHeading title="创建账号" description="填写以下信息，几步完成注册" />
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
          label="姓名"
          icon={User}
          autoComplete="name"
          placeholder="请输入姓名"
          value={form.values.name}
          error={form.errors.name}
          onChange={(event) => form.setValue("name", event.target.value)}
          onBlur={() => form.blur("name")}
        />
        <TextField
          id="sign-up-email"
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
        <div className="flex flex-col gap-2">
          <PasswordField
            id="sign-up-password"
            label="密码"
            icon={Lock}
            autoComplete="new-password"
            placeholder="至少 8 位，包含字母和数字"
            value={form.values.password}
            error={form.errors.password}
            onChange={(event) => form.setValue("password", event.target.value)}
            onBlur={() => form.blur("password")}
          />
          <PasswordStrength password={form.values.password} />
        </div>
        <PasswordField
          id="sign-up-confirm"
          label="确认密码"
          icon={Lock}
          autoComplete="new-password"
          placeholder="再次输入密码"
          value={form.values.confirm}
          error={form.errors.confirm}
          onChange={(event) => form.setValue("confirm", event.target.value)}
          onBlur={() => form.blur("confirm")}
        />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="sign-up-terms"
              checked={form.values.terms}
              aria-invalid={form.errors.terms ? true : undefined}
              aria-describedby={form.errors.terms ? "sign-up-terms-error" : undefined}
              onCheckedChange={(checked) => form.setValue("terms", checked === true)}
            />
            <Label
              htmlFor="sign-up-terms"
              className="cursor-pointer leading-5 font-normal"
            >
              我已阅读并同意
              <a href={termsHref} className="text-primary underline-offset-4 hover:underline">
                服务条款
              </a>
              和
              <a href={privacyHref} className="text-primary underline-offset-4 hover:underline">
                隐私政策
              </a>
            </Label>
          </div>
          {form.errors.terms ? (
            <p id="sign-up-terms-error" className="text-xs text-destructive">
              {form.errors.terms}
            </p>
          ) : null}
        </div>
        <SubmitButton pending={form.pending} pendingText="注册中…">
          注册
        </SubmitButton>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        已有账号？ <LinkButton onClick={onSwitchToSignIn}>登录</LinkButton>
      </p>
    </div>
  )
}
