<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# travinsy.com — 项目 Agent 指南

个人作品集 + shadcn 风格组件库（Registry）。默认语言 **简体中文**。
所有在本仓库工作的 Agent（Claude / Codex / Pi）都必须先读完本文件。

## 1. 技术栈

| 项 | 选型 |
|---|---|
| 框架 | Next.js 16（App Router，`src/` 目录，Turbopack） |
| 运行时 | Node 24（见 `.nvmrc`），pnpm 10 |
| 样式 | Tailwind CSS v4 + shadcn/ui（`base-nova` 风格，**Base UI** 底座 `@base-ui/react`，不是 Radix） |
| 内容 | Fumadocs **内容层**：`fumadocs-core` + `fumadocs-mdx`。**不使用 `fumadocs-ui`**，所有页面 UI 自己写（与 shadcn 官网相同的做法） |
| 动画 | `motion` |
| 高亮 | `shiki` |
| 主题 | `next-themes`（亮/暗）+ 自定义颜色主题（`data-theme`） |
| 部署 | **纯静态导出** `output: "export"` → 阿里云 OSS（部署后期再做） |

## 2. 常用命令

```bash
source ~/.nvm/nvm.sh && nvm use      # 每个新 shell 都要先切到 Node 24
pnpm dev                              # 开发
pnpm build                            # 静态构建，产物在 out/
pnpm lint
pnpm registry:build                   # 生成 public/r/*.json（registry 管道建好后可用）
```

**环境注意**：本机 `ALL_PROXY` 是 SOCKS 代理，会导致 `shadcn` CLI 请求失败（`other side closed`）。
运行 shadcn CLI 时去掉它：

```bash
env -u ALL_PROXY -u all_proxy pnpm dlx shadcn@latest add <name>
```

## 3. 目录约定

```
content/                     MDX 内容（Fumadocs 读取）
  docs/components/*.mdx      组件文档
  docs/blocks/*.mdx          区块文档
  docs/templates/*.mdx       页面风格模板文档
  docs/agents/*.mdx          Agent 开发引导
  blog/*.mdx                 博客
src/
  app/                       路由（全部可静态生成）
  components/
    ui/                      shadcn 官方原语（CLI 安装，尽量不手改）
    site/                    站点外壳：Header、Footer、主题切换、导航
    docs/                    文档渲染：ComponentPreview、CodeBlock、InstallCommand、PropsTable
  registry/                  ★ 对外发布的 registry 源码（唯一真源）
    ui/<name>/               registry:ui 组件（含线条网格原语 ui/grid-layout，站点自身也直接 import 它）
    blocks/<name>/           registry:block
    templates/<name>/        registry:page / 多文件页面模板
    examples/<name>-demo.tsx 文档里用的演示
  styles/                    grid.css（网格工具类）、themes.css（颜色主题）、docs.css（文档/代码样式）
  lib/                       source.ts（Fumadocs loader）、themes.ts、utils.ts
registry.json                shadcn registry 清单
public/r/                    `shadcn build` 产物（生成物，不手改）
scripts/                     构建辅助脚本
```

## 4. 硬性规则

### 禁止提及参考站点（任何文件都必须满足）
- 网站和仓库的任何地方（页面文案、博客、文档、代码注释、registry、技能文件、提交信息）都**不得提及设计参考站点的名字**，也不写“参考/借鉴某个人网站”之类的说法
- 设计来源只描述做法本身（如“线条网格”“等轴测挤出”），不写出处
- 禁提词清单在仓库根目录的 `.forbidden-terms`（已 gitignore，只存在于维护者本机）。提交前用 `grep -rIil -f .forbidden-terms --exclude-dir={node_modules,.next,.source,.git} --exclude=.forbidden-terms .` 自查，结果必须为空（包括构建产物 `out/`）；本机没有该文件时跳过此项

### 静态导出（任何代码都必须满足）
- 禁止：Server Actions、`cookies()`/`headers()`、依赖 Request 的 Route Handler、`proxy`/middleware、rewrites/redirects/headers 配置、ISR、默认 loader 的图片优化
- 动态路由必须有 `generateStaticParams()` 且 `dynamicParams = false`
- 生成文本文件的 Route Handler（如 `llms.txt`、`rss.xml`）必须 `export const dynamic = "force-static"`
- `trailingSlash: true`（OSS 用 `xxx/index.html` 路由）
- 外部动态数据（如 GitHub 贡献图）只在**构建时**获取，失败时要有兜底数据，不能让构建挂掉

### 设计系统
- 视觉语言：**线条网格**。内容区左右竖线、全宽横线分隔、斜纹分隔带。只用 `@/registry/ui/grid-layout` 里的原语和 `src/styles/grid.css` 里的工具类实现，不要每个页面手写边框
- 颜色只能用主题变量（`bg-background`、`text-muted-foreground`、`border-border`……），**禁止硬编码颜色**，否则颜色主题切换会失效
- 亮暗模式和颜色主题是两个独立维度：`.dark` class + `data-theme` 属性
- 字体：拉丁/代码用 Geist / Geist Mono；中文用系统字体栈（PingFang SC、HarmonyOS Sans SC、Noto Sans SC），**不打包中文 webfont**
- 按钮高度只有三档：`sm` 28px / `default` 32px / `lg` 36px（图标按钮对应 `icon-sm` / `icon` / `icon-lg`），只能通过 `Button` 或 `buttonVariants` 的 `size` 取得；同一行并排的按钮必须同一档，例外须注释说明（详见 `component-conventions` 技能第 6 节）
- 可访问性：遵循 `web-design-guidelines` 技能

### 语言
- 博客（`content/blog/`）用 `humanizer-zh` 技能润色
- 界面文案、文档、注释的默认语言为简体中文；代码标识符用英文
- `<html lang="zh-CN">`；英文版以后放在 `/en`，现在不做，但不要写死无法扩展的结构

### Registry
- 对外发布的代码只放在 `src/registry/`，文档预览、代码展示、`public/r/*.json` 都从同一份源码读取，**禁止复制粘贴副本**
- 新增或修改 registry 条目请按 `registry-item` 技能执行
- **所有 registry 代码必须遵守 `component-conventions` 技能（组件书写规范）**：分层依赖、命名、data-slot、导出方式、Props 约定、labels 文案、样式 token、可访问性、文档结构。写任何组件前先读它

## 5. 项目级技能（`.agents/skills/`，`.claude/skills` 和 `.pi/skills` 是指向它的软链接）

| 技能 | 用途 | 何时必读 |
|---|---|---|
| `shadcn` | shadcn CLI、组件组合、registry 规范 | 增删 `components/ui`、写 registry |
| `next-best-practices` | Next.js 文件约定、RSC 边界、元数据 | 写任何路由/布局 |
| `vercel-react-best-practices` | React 性能 | 写交互组件 |
| `frontend-design` | 高质量视觉设计 | 做新页面、新组件外观 |
| `web-design-guidelines` | UI/可访问性审查 | 交付 UI 前自查 |
| `next-dev-loop` | 在运行中的 `next dev` 里验证行为 | 验收 UI 改动 |
| `component-conventions` | **组件书写规范（强制）** | 写/改 src/registry 下任何代码 |
| `registry-item` | 本项目新增 registry 组件的完整流程 | 新增/修改组件、区块、模板、主题 |
| `grid-design` | 本项目线条网格设计规范 | 做任何页面布局 |
| `humanizer-zh` | 中文文本润色：去空话、套话和模板化表达 | 撰写或修改 `content/blog/` 下的博客，成稿前必须用它过一遍 |

查第三方库文档优先用 context7 MCP；Next.js 以 `node_modules/next/dist/docs/` 为准。

## 6. 多 Agent 协作与模型调度

本项目由 **主控 Agent（Claude Opus 5.5，主线程）** 统一掌控，通过 T3 Code 的 `delegate_task` 派发子任务。

### 分工

| 角色 | 模型（T3 provider / model / 选项） | 负责 |
|---|---|---|
| 主控 | `claudeAgent` / `claude-opus-5-5` | 架构与目录规划、任务拆分、接口约定、代码审查、集成、最终验收 |
| 重要代码 A | `claudeAgent` / `claude-sonnet-5-5`，`effort: high` | 核心架构代码：布局原语、主题系统、文档渲染管道、复杂交互组件 |
| 重要代码 B | `codex_gg`（GG）或 `codex`（KLX）/ `gpt-6.1-sol`，`reasoningEffort: medium` | 同上，与 A 互为替补 |
| 简单/重复/等待 | `pi` / `travins_newapi/deepseek-flash`，`thinking: max` | 批量写 MDX 文档和 demo、文案、照着现成模式新增组件、修 lint/类型错误、跑构建和检查、生成 registry、截图验收等 |

**调度规则**
1. A 和 B 按 T3 中的剩余额度选择：额度多的优先；一方受限或报错时切换到另一方（Codex 两个实例 GG/KLX 也互为替补）。
2. 能用 Pi DeepSeek Flash 完成的任务一律交给它，不要占用高端模型。判断标准：已有可照抄的模式、验收标准明确、出错代价低。
3. 主控只在任务需要跨模块判断，或子任务两次失败后才亲自写代码。

### 派发任务的要求
- 任务说明必须**自包含**：目标、要读的文件和技能、允许修改的文件范围、验收标准（如 `pnpm build` 通过）
- 共享工作区里并行的子任务，**修改的文件范围不能重叠**；有重叠就串行，或者用 `isolation: "worktree"`
- 子 Agent **不要 git commit**，完成后汇报：修改了哪些文件、做了哪些取舍、还有什么遗留问题
- 子 Agent 改完都必须运行 `pnpm lint` 和 `pnpm build`（或者说明为什么没跑）
- 主控审查后统一提交
