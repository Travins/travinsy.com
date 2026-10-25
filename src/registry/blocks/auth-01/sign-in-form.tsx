"use client"

import { KeyRound, Lock, Smartphone, User } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  FormError,
  LinkButton,
  PasswordField,
  SubmitButton,
  TextField,
  ViewHeading,
} from "./form-parts"
import { codeSignInSchema, signInSchema } from "./schemas"
import { SocialButtons, type SocialProvider } from "./social-buttons"
import { useAsyncAction, useAuthForm } from "./use-auth-form"

export type SignInValues =
  | { method: "password"; account: string; password: string; remember: boolean }
  | { method: "code"; phone: string; code: string }

const CODE_COOLDOWN = 60

function PasswordSignIn({
  onSignIn,
  onForgotPassword,
}: {
  onSignIn: (values: SignInValues) => Promise<void>
  onForgotPassword: () => void
}) {
  const form = useAuthForm(signInSchema, {
    account: "",
    password: "",
    remember: false,
  })
  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) =>
        onSignIn({ method: "password", ...values }),
      )}
      className="flex flex-col gap-5"
    >
      <FormError message={form.formError} />
      <TextField
        id="sign-in-account"
        label="用户名或邮箱"
        icon={User}
        autoComplete="username"
        placeholder="请输入用户名或邮箱"
        value={form.values.account}
        error={form.errors.account}
        onChange={(event) => form.setValue("account", event.target.value)}
        onBlur={() => form.blur("account")}
      />
      <PasswordField
        id="sign-in-password"
        label="密码"
        icon={Lock}
        autoComplete="current-password"
        placeholder="请输入密码"
        value={form.values.password}
        error={form.errors.password}
        onChange={(event) => form.setValue("password", event.target.value)}
        onBlur={() => form.blur("password")}
        labelAction={
          <LinkButton className="text-xs" onClick={onForgotPassword}>
            忘记密码？
          </LinkButton>
        }
      />
      <div className="flex items-center gap-2">
        <Checkbox
          id="sign-in-remember"
          checked={form.values.remember}
          onCheckedChange={(checked) => form.setValue("remember", checked === true)}
        />
        <Label htmlFor="sign-in-remember" className="cursor-pointer font-normal">
          记住登录状态
        </Label>
      </div>
      <SubmitButton pending={form.pending} pendingText="登录中…">
        登录
      </SubmitButton>
    </form>
  )
}

function CodeSignIn({
  onSignIn,
  onSendCode,
}: {
  onSignIn: (values: SignInValues) => Promise<void>
  onSendCode: (phone: string) => Promise<void>
}) {
  const form = useAuthForm(codeSignInSchema, { phone: "", code: "" })
  const sender = useAsyncAction()
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    if (seconds <= 0) return
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [seconds])

  const sendCode = async () => {
    if (!form.validateField("phone")) return
    const sent = await sender.run(() => onSendCode(form.values.phone.trim()))
    if (sent) setSeconds(CODE_COOLDOWN)
  }
  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) =>
        onSignIn({ method: "code", ...values }),
      )}
      className="flex flex-col gap-5"
    >
      <FormError message={form.formError ?? sender.error} />
      <TextField
        id="sign-in-phone"
        label="手机号"
        icon={Smartphone}
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        placeholder="请输入 11 位手机号"
        value={form.values.phone}
        error={form.errors.phone}
        onChange={(event) => form.setValue("phone", event.target.value)}
        onBlur={() => form.blur("phone")}
      />
      <TextField
        id="sign-in-code"
        label="验证码"
        icon={KeyRound}
        inputMode="numeric"
        maxLength={6}
        autoComplete="one-time-code"
        placeholder="6 位数字验证码"
        value={form.values.code}
        error={form.errors.code}
        onChange={(event) => form.setValue("code", event.target.value)}
        onBlur={() => form.blur("code")}
        adjacent={
          <Button
            type="button"
            variant="outline"
            className="h-10 w-28 shrink-0 tabular-nums"
            disabled={sender.pending || seconds > 0}
            onClick={sendCode}
          >
            {sender.pending
              ? "发送中…"
              : seconds > 0
                ? `${seconds}s 后重发`
                : "获取验证码"}
          </Button>
        }
      />
      <SubmitButton pending={form.pending} pendingText="登录中…">
        登录
      </SubmitButton>
    </form>
  )
}

export function SignInForm({
  socialProviders,
  allowSignUp,
  onSignIn,
  onSendCode,
  onSocialSignIn,
  onForgotPassword,
  onSwitchToSignUp,
}: {
  socialProviders: readonly SocialProvider[]
  allowSignUp: boolean
  onSignIn: (values: SignInValues) => Promise<void>
  onSendCode: (phone: string) => Promise<void>
  onSocialSignIn: (provider: SocialProvider) => Promise<void>
  onForgotPassword: () => void
  onSwitchToSignUp: () => void
}) {
  const [method, setMethod] = useState("password")
  const social = useAsyncAction()
  return (
    <div className="flex flex-col gap-5">
      <ViewHeading title="欢迎回来" description="请输入您的账号信息登录" />
      <Tabs value={method} onValueChange={(value) => setMethod(String(value))}>
        <TabsList aria-label="登录方式" className="w-full">
          <TabsTrigger value="password">密码登录</TabsTrigger>
          <TabsTrigger value="code">验证码登录</TabsTrigger>
        </TabsList>
        <TabsContent value="password" className="pt-3">
          <PasswordSignIn
            onSignIn={onSignIn}
            onForgotPassword={onForgotPassword}
          />
        </TabsContent>
        <TabsContent value="code" className="pt-3">
          <CodeSignIn onSignIn={onSignIn} onSendCode={onSendCode} />
        </TabsContent>
      </Tabs>
      {socialProviders.length > 0 && (
        <>
          <div
            role="separator"
            className="flex items-center gap-3 text-xs text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border"
          >
            或
          </div>
          <FormError message={social.error} />
          <SocialButtons
            providers={socialProviders}
            pending={social.pending}
            onSelect={(provider) =>
              social.run(() => onSocialSignIn(provider))
            }
          />
        </>
      )}
      {allowSignUp && (
        <p className="text-center text-sm text-muted-foreground">
          还没有账号？{" "}
          <LinkButton onClick={onSwitchToSignUp}>注册</LinkButton>
        </p>
      )}
    </div>
  )
}
