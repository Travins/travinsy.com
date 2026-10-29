# Registry 规范检查实现与扫描报告

扫描时间：2026-10-25T21:54（共享工作区快照：另一个 Agent 正在整改 `src/registry/blocks/**` 与
`src/registry/templates/**`，它们的导入改动尚未同步到 `registry.json` 的 `files`，所以快照里
`registry-deps` 还有 14 个 error，不属于本检查器的误报）。

快照结果：0 warn（全仓库）；error 仅剩上述 14 条 `registry-deps`。`src/registry/ui/**`、
`src/registry/examples/**`、`src/registry/hooks/**` 已无任何诊断。

本报告记录检查器本身的实现与边界。规则口径以本文件与 `scripts/registry-lint.ts` 顶部注释为准。

## 修改文件

- `scripts/registry-lint.ts`：检查器、CLI、彩色分组输出与 JSON 输出。
- `scripts/registry-lint/self-test.ts`：无测试框架断言与 CLI 子进程自测。
- `scripts/registry-lint/__fixtures__/invalid.tsx.fixture`：故意违规样例。
- `scripts/registry-lint/__fixtures__/valid.tsx.fixture`：合规和豁免样例。
- `scripts/registry-lint/REPORT.md`：本报告。
- `package.json`：仅 scripts 新增 registry:lint，未修改 prebuild。

## 验证

- `pnpm registry:lint --self-test`：通过。
- `pnpm registry:lint`：全仓库 0 warn；`src/registry/ui/**`、`src/registry/examples/**`、
  `src/registry/hooks/**` 无诊断。剩余 error 都是另一个 Agent 正在整改的 `blocks` / `templates` 的
  `registry-deps`（`registry.json` 尚未登记新增的 `config.ts`）。
- `pnpm lint`：通过。
- `pnpm exec tsc --noEmit --pretty false`：通过。
- `npx prettier --check` 对 `src/registry/ui`、`src/registry/examples`、`src/registry/hooks`
  与两个脚本文件：通过。
- 未运行 `pnpm build`：共享工作区里另一个 Agent 同时在改 `blocks`/`templates`，构建会互相污染；
  由主控统一构建。
- 未 git commit。

## 忽略注释

```ts
// registry-lint-disable-next-line exports-at-end, data-slot
export function Panel() { return <div /> }
```

- 只认紧邻上一行的单行注释 `// registry-lint-disable-next-line <规则 id>[, <规则 id>]`，作用范围是**下一行**
  （空行会让指令失效）。
- **必须写明规则 id**：不写 id、或写了未知 id，都会报 `disable-comment` error，避免“整行静音”。
- 只忽略该行上、该规则产生的诊断；同一行的其他规则照常报告。
- 指令靠 TypeScript 扫描器识别真正的注释，字符串或模板里出现同样的文本不算指令。
- 被忽略的条数统计在报告末尾（`…，已忽略 N 条（exports-at-end 2）`），JSON 输出在
  `summary.ignored`（`total` + 按规则的 `byRule`）与顶层 `ignored` 明细里。忽略不会让退出码变化。

## 检查范围

- 扫描 `src/registry` 下所有 `.ts` / `.tsx`，**排除生成文件** `src/registry/__index__.tsx`
  （由 `scripts/build-registry-index.ts` 重写），不再因为生成代码产生误报。
- `registry.json` 单独检查（`registry-deps`）。

## 规则实现及边界

- 使用 TypeScript AST 遍历声明、指令、函数直接返回值、JSX、模块引用、调用表达式；不会将注释误当代码。
- 命名导出、默认导出及默认导出别名均可识别。
- `no-default-export`：`page.tsx`、`layout.tsx`、`demo.tsx` 与 `src/registry/examples/**` 例外。
- `exports-at-end`：检查直接导出的函数与变量，允许类型导出，不额外验证 export 列表实际在文件末尾。
  `page.tsx`、`layout.tsx`、`demo.tsx` 与 `src/registry/examples/**` 不检查——它们按 Next.js 与演示约定
  就地导出。
- `data-slot` 只查 ui/blocks/templates 中直接返回原生 JSX 的大写命名函数，跳过嵌套函数返回值。
  Fragment、其他组件、条件表达式、通过变量返回 JSX 不检查；`page.tsx`、`layout.tsx`、`demo.tsx` 与
  `examples/**` 例外。箭头组件告警沿用直接返回 JSX 的识别边界；memo 等包装调用不做类型推导。
- 颜色检查扫描 className 表达式和 cva 参数中的字符串/模板片段，覆盖 Tailwind 默认调色板与要求的前缀；
  支持 cva 导入别名。不会追踪跨语句或跨文件的类名常量、拼接生成的颜色、别名转赋值；cva 参数中即使是
  非样式用途的字符串也可能命中。
- forwardRef 支持直接调用、属性调用及 React 命名导入别名；任意对象的同名 forwardRef 方法也会命中，
  不追踪再赋值、计算属性调用或局部同名遮蔽。
- import 检查包括静态 import、re-export、import type、动态 import/require 的字符串字面量。私有路径和
  依赖层级同时检查 `@/` 别名与相对路径；不解析其他 tsconfig 自定义别名或计算式模块路径。
- registry-deps 对每个条目 files 汇总 import；npm 按顶层包名归一化（包含 scope、子路径和声明版本），
  跳过 react/react-dom/next 与 Node 内建模块；未使用的 npm 声明为 warn。
- registryDependencies 接受裸条目名、`@yiui/name`、homepage 同域 `/r/name.json` URL；外站同名 URL
  不满足本站依赖。跨条目与相对引用按文件归属校验，覆盖无扩展名和 index.ts/tsx 及 .js 到 .ts/.tsx 映射；
  不递归允许间接依赖，也不推断 re-export 所需的额外 npm 包。
- labels 仅查 JSX 文本节点，每文件最多三处；`DEFAULT_LABELS`、`config.ts`、`demo.tsx`、`page.tsx` 豁免；
  属性值、表达式中的中文字符串不检查。文案是否需要覆盖仍需人工判断。
- storage-key-prefix 只查 `localStorage.getItem/setItem` 的静态字符串或无插值模板 key（包含
  `window.localStorage`），不追踪常量/别名或动态 key。
- disable-comment 只针对忽略注释本身（缺规则 id、未知规则 id）。
- JSON 输出为 `diagnostics`、`ignored`、`summary`（含 `byRule` 与 `ignored`）、`maxWarnings`、
  `maxWarningsExceeded`；有 error 或超过 `--max-warnings` 时退出 1。非 TTY 不输出 ANSI。

## 自测覆盖

`pnpm registry:lint --self-test` 覆盖：

- `invalid.tsx.fixture` 命中全部可触发规则；`valid.tsx.fixture` 无诊断。
- `no-default-export` / `data-slot` 在 `page.tsx`、`layout.tsx`、`demo.tsx`、`examples/**` 的豁免。
- `exports-at-end` 在 `examples/**` 与 `page/layout/demo.tsx` 的豁免，以及普通模块里仍会报两条。
- 忽略注释：单规则、多规则、只作用于紧邻下一行、字符串里的同名文本不算指令、缺 id 与未知 id 报
  `disable-comment`。
- 颜色、import、forwardRef、cva 别名、labels 计数等既有断言。
- 子进程验证 `--rule`、`--json`、`--max-warnings`、退出码、生成文件 `src/registry/__index__.tsx` 被排除，
  以及忽略条数进入 `summary.ignored` 与文本汇总。

## 按规则统计（本次快照）

- `no-default-export`：error 0 / warn 0
- `exports-at-end`：error 0 / warn 0
- `use-client-first`：error 0 / warn 0
- `data-slot`：error 0 / warn 0
- `function-declaration`：error 0 / warn 0
- `no-forward-ref`：error 0 / warn 0
- `no-hardcoded-color`：error 0 / warn 0
- `forbidden-import`：error 0 / warn 0
- `registry-deps`：error 14 / warn 0（均为 `blocks` / `templates` 的进行中改动）
- `labels`：error 0 / warn 0
- `storage-key-prefix`：error 0 / warn 0
- `disable-comment`：error 0 / warn 0

已忽略：0 条。
