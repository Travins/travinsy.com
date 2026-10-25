import { z } from "zod"

// 校验规则与提示集中在这里：想换手机号规则、密码策略，只改这个文件
const email = z
  .string()
  .trim()
  .min(1, "请输入邮箱")
  .email("请输入有效的邮箱地址")

/** 中国大陆 11 位手机号；面向海外用户时请替换为自己的规则 */
const phone = z
  .string()
  .trim()
  .regex(/^1[3-9]\d{9}$/, "请输入有效的 11 位手机号")

const password = z
  .string()
  .min(8, "密码至少 8 位")
  .regex(/[A-Za-z]/, "密码需要包含字母")
  .regex(/\d/, "密码需要包含数字")

const signInSchema = z.object({
  account: z.string().trim().min(1, "请输入用户名或邮箱"),
  password: z.string().min(1, "请输入密码"),
  remember: z.boolean(),
})

const codeSignInSchema = z.object({
  phone,
  code: z.string().trim().regex(/^\d{6}$/, "请输入 6 位数字验证码"),
})

const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "姓名至少 2 个字符"),
    email,
    password,
    confirm: z.string().min(1, "请再次输入密码"),
    terms: z.boolean().refine((value) => value, "请先阅读并同意服务条款"),
  })
  .refine((values) => values.password === values.confirm, {
    message: "两次输入的密码不一致",
    path: ["confirm"],
  })

const forgotPasswordSchema = z.object({ email })

export {
  codeSignInSchema,
  forgotPasswordSchema,
  signInSchema,
  signUpSchema,
}
