"use client"

import { Auth01 } from "@/registry/blocks/auth-01/auth-01"

/**
 * 登录页入口：把下面几个回调换成你自己的认证实现。
 * 回调返回 Promise；失败时 throw new Error("中文原因")，组件会显示在表单上方。
 * 登录成功后的跳转请在 onSignIn / onSocialSignIn 里自行处理，例如 router.push("/")。
 */
export default function LoginPage() {
  return (
    <Auth01
      brand={{ name: "Acme" }}
      onSignIn={async (values) => {
        // TODO: 调用你的认证服务，例如 authClient.signIn.email(...)
        console.info("sign in", values)
        await new Promise((resolve) => setTimeout(resolve, 600))
      }}
      onSignUp={async (values) => {
        console.info("sign up", values)
        await new Promise((resolve) => setTimeout(resolve, 600))
      }}
      onForgotPassword={async (email) => {
        console.info("forgot password", email)
        await new Promise((resolve) => setTimeout(resolve, 600))
      }}
      onSendCode={async (phone) => {
        console.info("send code", phone)
        await new Promise((resolve) => setTimeout(resolve, 600))
      }}
      onSocialSignIn={async (provider) => {
        console.info("social sign in", provider)
        await new Promise((resolve) => setTimeout(resolve, 600))
      }}
    />
  )
}
