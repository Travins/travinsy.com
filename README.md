<div align="center">

<a href="https://travinsy.com">
  <img src="src/app/icon.svg" alt="Yi UI" width="56" height="56" />
</a>

<h1>Yi UI</h1>

<p><strong>易</strong> · 线条网格风格的 React 组件库：源码直接装进你的项目，装完就是你自己的代码。</p>

<p>
  <a href="https://travinsy.com">官网</a> ·
  <a href="https://travinsy.com/components/">组件</a> ·
  <a href="https://travinsy.com/blocks/">区块</a> ·
  <a href="https://travinsy.com/templates/">模板</a> ·
  <a href="https://travinsy.com/themes/">主题</a> ·
  <a href="https://travinsy.com/docs/installation/">文档</a>
</p>

<p><strong>简体中文</strong> · <a href="./README.en.md">English</a></p>

</div>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/preview-dark.png" />
  <img src=".github/assets/preview-light.png" alt="travinsy.com 首页：等轴测标志与调整面板" />
</picture>

## 简介

Yi UI 是一个以 **shadcn registry** 形式发布的组件库，托管在作者的个人站点 [travinsy.com](https://travinsy.com) 上。组件不打成 npm 包，而是用 shadcn CLI 把源码复制进你的项目，样式、结构、交互都可以直接改。

名字取自站点标志「易」（三道细斜杠是「日」，三道粗斜杠是「勿」）：既是「容易上手」，也是「随你改动」。

视觉上统一使用「线条网格」语言：全宽横线、竖线容器、点阵分隔带，配合细边框、小圆角与克制的动效。

## 特点

- **源码归你** —— 通过 shadcn CLI 安装，组件、依赖的其他条目、需要的 CSS 变量会一并写入项目。
- **Base UI 底座** —— 交互原语基于 [Base UI](https://base-ui.com)，键盘操作、焦点管理与读屏语义开箱即用。
- **跟随主题** —— 所有颜色都取自主题变量：亮 / 暗模式加 14 套颜色主题，切换时组件自动变色。
- **方条控件系列** —— 数值滑块、分段选择、开关、色调、角度、二维拖拽板共用一套高度与外观，可以拼成参数面板，并一键把当前参数复制为 JSX。
- **动效有分寸** —— 进入视口才播放、离屏自动暂停、尊重「减少动态效果」。
- **静态友好** —— 全站纯静态导出；依赖测量或画布的组件在脚本加载前渲染同尺寸占位，不会出现空白或布局跳动。
- **对 AI 友好** —— 每篇文档都有 Markdown 版本，并提供 [`llms.txt`](https://travinsy.com/llms.txt) 与 [`llms-full.txt`](https://travinsy.com/llms-full.txt)。

## 快速开始

需要 React 19、Tailwind CSS v4，以及选择了 **Base UI** 底座的 shadcn 项目。

```bash
# 新建项目（已有项目去掉 -t / -n 两个参数）
pnpm dlx shadcn@latest init -t next -b base -p nova -n my-app

# 用完整地址安装任意组件
pnpm dlx shadcn@latest add https://travinsy.com/r/value-slider.json
```

想用更短的命令，在 `components.json` 里登记命名空间：

```json
{
  "registries": {
    "@travinsy": "https://travinsy.com/r/{name}.json"
  }
}
```

```bash
pnpm dlx shadcn@latest add @travinsy/value-slider
```

完整说明（文件落点、依赖、样式写入与常见问题）见[安装文档](https://travinsy.com/docs/installation/)。

## 组件

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/components-dark.png" />
  <img src=".github/assets/components-light.png" alt="组件列表" />
</picture>

| 分组 | 组件 |
| --- | --- |
| 图形与动效 | [等轴测标志](https://travinsy.com/components/isometric-mark/) · [流程动画图示](https://travinsy.com/components/flow-diagram/) · [点阵地球](https://travinsy.com/components/globe/) · [字符矩阵](https://travinsy.com/components/glyph-field/) · [动态格](https://travinsy.com/components/shuffle-grid/) · [轨道环绕](https://travinsy.com/components/orbit/) · [波纹脉冲](https://travinsy.com/components/ripple/) · [代码文件堆叠](https://travinsy.com/components/code-stack/) |
| 表单与输入 | [数值滑块](https://travinsy.com/components/value-slider/) · [控制面板](https://travinsy.com/components/control-panel/) · [二维拖拽板](https://travinsy.com/components/xy-pad/) · [角度刻度尺](https://travinsy.com/components/angle-dial/) · [分段选择](https://travinsy.com/components/segmented-control/) · [方条开关](https://travinsy.com/components/toggle-switch/) · [色调选择](https://travinsy.com/components/tone-picker/) |
| 数据展示 | [图表卡片](https://travinsy.com/components/chart-card/) · [统计卡片](https://travinsy.com/components/stat-card/) · [迷你图](https://travinsy.com/components/mini-chart/) |
| 文字与滚动 | [文字动效](https://travinsy.com/components/text-animate/) · [跑马灯](https://travinsy.com/components/marquee/) |
| 内容展示 | [时间线](https://travinsy.com/components/timeline/) · [卡片堆叠](https://travinsy.com/components/card-stack/) · [手写清单](https://travinsy.com/components/checklist/) |
| 时间 | [实时当地时间](https://travinsy.com/components/local-time/) · [时段问候](https://travinsy.com/components/greeting/) |
| 布局 | [线条网格布局](https://travinsy.com/components/grid-layout/) |

## 区块与模板

| 名称 | 说明 |
| --- | --- |
| [设置页 `settings-01`](https://travinsy.com/blocks/settings-01/) | 用方条控件拼成的完整设置页：分区导航、实时预览、已修改计数、恢复默认与异步保存。 |
| [分屏登录页 `auth-01`](https://travinsy.com/blocks/auth-01/) | 品牌面板加表单：密码 / 验证码登录、注册（带强度条）、找回密码。 |
| [AI 助手面板 `agent-chat-01`](https://travinsy.com/blocks/agent-chat-01/) | 嵌入与浮动两种布局，展示分析摘要、工具调用、来源与图表，内置流式演示。 |
| [企业控制台布局 `app-shell-01`](https://travinsy.com/templates/app-shell-01/) | 固定顶栏、可折叠导航、工作区侧栏与 AI 助手，带统计卡与图表的示例页面。 |

## 颜色主题

中性、石色、板岩三套灰阶基底，加红、橙、琥珀、青柠、绿、青绿、天蓝、蓝、紫罗兰、紫红、粉红 11 套彩色主题；彩色主题的按钮一律白字，对比度都在 4.5:1 以上。可以在[主题页](https://travinsy.com/themes/)预览后复制 CSS 变量，或直接安装：

```bash
pnpm dlx shadcn@latest add https://travinsy.com/r/theme-blue.json
```

## 本地开发

```bash
git clone https://github.com/Travins/yi-ui.git
cd yi-ui
nvm use          # Node 24（见 .nvmrc）
pnpm install
pnpm dev
```

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 静态构建，产物在 `out/` |
| `pnpm lint` | 代码检查 |
| `pnpm registry:build` | 生成 `public/r/*.json` 等 registry 产物 |
| `pnpm registry:lint` | 检查 registry 条目的依赖、文件与书写规范 |
| `pnpm qa:shots <组件名>` | 对构建产物截图验收（亮暗、颜色主题、窄屏、报错与溢出） |
| `pnpm qa:loading` | 拦截脚本检查加载前的占位与空白 |

## 目录结构

```
content/            文档与博客（MDX）
src/registry/       对外发布的源码（唯一真源）
  ui/               组件
  blocks/           区块
  templates/        页面模板
  examples/         文档里的示例
src/components/     站点自身的外壳、文档渲染、首页
src/styles/         线条网格、颜色主题与文档样式
registry.json       registry 清单
public/r/           构建生成的 registry JSON
```

文档预览、代码展示与 `public/r/*.json` 都读取 `src/registry/` 里的同一份源码。

## 技术栈

[Next.js](https://nextjs.org) 16（App Router，纯静态导出）· [React](https://react.dev) 19 · [Tailwind CSS](https://tailwindcss.com) v4 · [shadcn/ui](https://ui.shadcn.com) · [Base UI](https://base-ui.com) · [Motion](https://motion.dev) · [Fumadocs](https://fumadocs.dev)（内容层）· [Shiki](https://shiki.style) · [Recharts](https://recharts.org)

## 参与贡献

欢迎提交 Issue 与 Pull Request，流程与规范见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 许可证

[MIT](./LICENSE) © Travins
