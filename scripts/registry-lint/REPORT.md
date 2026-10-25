# Registry 规范检查实现与扫描报告

扫描时间：2026-10-25T21:43:53（共享工作区快照，其他 Agent 后续改动可能改变结果）。

结果：0 error，106 warn；默认退出码 0。

## 修改文件

- `scripts/registry-lint.ts`：检查器、CLI、彩色分组输出与 JSON 输出。
- `scripts/registry-lint/self-test.ts`：无测试框架断言与 CLI 子进程自测。
- `scripts/registry-lint/__fixtures__/invalid.tsx.fixture`：故意违规样例。
- `scripts/registry-lint/__fixtures__/valid.tsx.fixture`：合规和豁免样例。
- `scripts/registry-lint/REPORT.md`：本报告。
- `package.json`：仅 scripts 新增 registry:lint，未修改 prebuild。

## 验证

- `pnpm registry:lint --self-test`：通过。
- `pnpm registry:lint`：通过，诊断如下。
- `pnpm lint`：通过。
- `pnpm exec tsc --noEmit --pretty false`：通过。
- 未运行 `pnpm build`：prebuild 会重写授权范围以外的 registry 生成物；本任务未修改组件或 Next.js 应用代码。
- 未 git commit。

## 规则实现及边界

- 使用 TypeScript AST 遍历声明、指令、函数直接返回值、JSX、模块引用、调用表达式；不会将注释误当代码。
- 命名导出、默认导出及默认导出别名均可识别；exports-at-end 按要求检查直接导出的函数与变量，允许类型导出，不额外验证 export 列表实际在文件末尾。
- data-slot 只查 ui/blocks/templates 中直接返回原生 JSX 的大写命名函数，跳过嵌套函数返回值。Fragment、其他组件、条件表达式、通过变量返回 JSX 不检查。箭头组件告警沿用直接返回 JSX 的识别边界；memo 等包装调用不做类型推导。
- 颜色检查扫描 className 表达式和 cva 参数中的字符串/模板片段，覆盖 Tailwind 默认调色板与要求的前缀；支持 cva 导入别名。不会追踪跨语句或跨文件的类名常量、拼接生成的颜色、别名转赋值；cva 参数中即使是非样式用途的字符串也可能命中。
- forwardRef 支持直接调用、属性调用及 React 命名导入别名；任意对象的同名 forwardRef 方法也会命中，不追踪再赋值、计算属性调用或局部同名遮蔽。
- import 检查包括静态 import、re-export、import type、动态 import/require 的字符串字面量。私有路径和依赖层级同时检查 @/ 别名与相对路径；不解析其他 tsconfig 自定义别名或计算式模块路径。
- registry-deps 对每个条目 files 汇总 import；npm 按顶层包名归一化（包含 scope、子路径和声明版本），跳过 react/react-dom/next 与 Node 内建模块；未使用的 npm 声明为 warn。
- registryDependencies 接受裸条目名、@travinsy/name、homepage 同域 /r/name.json URL；外站同名 URL 不满足本站依赖。跨条目与相对引用按文件归属校验，覆盖无扩展名和 index.ts/tsx 及 .js 到 .ts/.tsx 映射；不递归允许间接依赖，也不推断 re-export 所需的额外 npm 包。
- labels 仅查 JSX 文本节点，每文件最多三处；DEFAULT_LABELS、config.ts、demo.tsx、page.tsx 豁免；属性值、表达式中的中文字符串不检查。文案是否需要覆盖仍需人工判断。
- storage-key-prefix 只查 localStorage.getItem/setItem 的静态字符串或无插值模板 key（包含 window.localStorage），不追踪常量/别名或动态 key。
- JSON 输出为 diagnostics、summary（含 byRule）、maxWarnings、maxWarningsExceeded；有 error 或超过 --max-warnings 时退出 1。非 TTY 不输出 ANSI。

## 按规则统计

- `no-default-export`：error 0 / warn 0
- `exports-at-end`：error 0 / warn 61
- `use-client-first`：error 0 / warn 0
- `data-slot`：error 0 / warn 29
- `function-declaration`：error 0 / warn 0
- `no-forward-ref`：error 0 / warn 0
- `no-hardcoded-color`：error 0 / warn 0
- `forbidden-import`：error 0 / warn 0
- `registry-deps`：error 0 / warn 0
- `labels`：error 0 / warn 16
- `storage-key-prefix`：error 0 / warn 0

## 前 50 条明细

```text
src/registry/__index__.tsx:5:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/__index__.tsx:15:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/blocks/agent-chat-01/demo.tsx:3:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/blocks/agent-chat-01/page.tsx:117:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/blocks/auth-01/auth-01.tsx:34:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/blocks/auth-01/auth-01.tsx:68:5 [warn data-slot] 组件 Auth01 的原生根元素必须有 data-slot
src/registry/blocks/auth-01/brand-panel.tsx:6:5 [warn data-slot] 组件 Logo 的原生根元素必须有 data-slot
src/registry/blocks/auth-01/brand-panel.tsx:16:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/blocks/auth-01/brand-panel.tsx:18:5 [warn data-slot] 组件 BrandPanel 的原生根元素必须有 data-slot
src/registry/blocks/auth-01/brand-panel.tsx:65:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/blocks/auth-01/brand-panel.tsx:67:5 [warn data-slot] 组件 MobileBrand 的原生根元素必须有 data-slot
src/registry/blocks/auth-01/brand.tsx:25:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/blocks/auth-01/demo.tsx:3:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/blocks/auth-01/forgot-password-form.tsx:17:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/blocks/auth-01/forgot-password-form.tsx:29:7 [warn data-slot] 组件 ForgotPasswordForm 的原生根元素必须有 data-slot
src/registry/blocks/auth-01/forgot-password-form.tsx:37:61 [warn labels] 用户可见文案应集中到 labels
src/registry/blocks/auth-01/forgot-password-form.tsx:39:13 [warn labels] 用户可见文案应集中到 labels
src/registry/blocks/auth-01/forgot-password-form.tsx:40:13 [warn labels] 用户可见文案应集中到 labels
src/registry/blocks/auth-01/forgot-password-form.tsx:50:5 [warn data-slot] 组件 ForgotPasswordForm 的原生根元素必须有 data-slot
src/registry/blocks/auth-01/form-parts.tsx:12:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/blocks/auth-01/form-parts.tsx:36:5 [warn data-slot] 组件 TextField 的原生根元素必须有 data-slot
src/registry/blocks/auth-01/form-parts.tsx:68:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/blocks/auth-01/form-parts.tsx:98:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/blocks/auth-01/form-parts.tsx:101:5 [warn data-slot] 组件 FormError 的原生根元素必须有 data-slot
src/registry/blocks/auth-01/form-parts.tsx:111:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/blocks/auth-01/form-parts.tsx:135:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/blocks/auth-01/form-parts.tsx:143:5 [warn data-slot] 组件 ViewHeading 的原生根元素必须有 data-slot
src/registry/blocks/auth-01/form-parts.tsx:151:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/blocks/auth-01/form-parts.tsx:156:5 [warn data-slot] 组件 LinkButton 的原生根元素必须有 data-slot
src/registry/blocks/auth-01/page.tsx:10:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/blocks/auth-01/password-strength.tsx:11:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/blocks/auth-01/password-strength.tsx:23:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/blocks/auth-01/password-strength.tsx:27:5 [warn data-slot] 组件 PasswordStrength 的原生根元素必须有 data-slot
src/registry/blocks/auth-01/schemas.ts:22:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/blocks/auth-01/schemas.ts:28:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/blocks/auth-01/schemas.ts:33:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/blocks/auth-01/schemas.ts:46:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/blocks/auth-01/sign-in-form.tsx:42:5 [warn data-slot] 组件 PasswordSignIn 的原生根元素必须有 data-slot
src/registry/blocks/auth-01/sign-in-form.tsx:73:13 [warn labels] 用户可见文案应集中到 labels
src/registry/blocks/auth-01/sign-in-form.tsx:84:11 [warn labels] 用户可见文案应集中到 labels
src/registry/blocks/auth-01/sign-in-form.tsx:88:9 [warn labels] 用户可见文案应集中到 labels
src/registry/blocks/auth-01/sign-in-form.tsx:116:5 [warn data-slot] 组件 CodeSignIn 的原生根元素必须有 data-slot
src/registry/blocks/auth-01/sign-in-form.tsx:172:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/blocks/auth-01/sign-in-form.tsx:192:5 [warn data-slot] 组件 SignInForm 的原生根元素必须有 data-slot
src/registry/blocks/auth-01/sign-up-form.tsx:22:1 [warn exports-at-end] 值导出应统一放在文件末尾 export { ... }
src/registry/blocks/auth-01/sign-up-form.tsx:41:5 [warn data-slot] 组件 SignUpForm 的原生根元素必须有 data-slot
src/registry/blocks/auth-01/sign-up-form.tsx:112:15 [warn labels] 用户可见文案应集中到 labels
src/registry/blocks/auth-01/sign-up-form.tsx:114:17 [warn labels] 用户可见文案应集中到 labels
src/registry/blocks/auth-01/sign-up-form.tsx:116:15 [warn labels] 用户可见文案应集中到 labels
src/registry/blocks/auth-01/social-buttons.tsx:9:5 [warn data-slot] 组件 GitHubIcon 的原生根元素必须有 data-slot
```
