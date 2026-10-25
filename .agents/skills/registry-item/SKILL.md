---
name: registry-item
description: 在 travinsy.com 新增或修改一个 shadcn registry 条目（组件 registry:ui、区块 registry:block、页面模板 registry:page、主题 registry:theme）的完整流程：源码位置、registry.json、演示、MDX 文档、构建与安装验证。
---

# 新增 registry 条目

> 唯一真源：`src/registry/`。文档预览、代码展示、`public/r/<name>.json` 都读同一份文件，禁止复制副本。

## 步骤

1. **写源码**
   - 组件：`src/registry/ui/<name>/<name>.tsx`
   - 区块：`src/registry/blocks/<name>/`（可多文件）
   - 页面模板：`src/registry/templates/<name>/`（可多文件，含 `page.tsx`）
   - 只用主题 token 的颜色；工具函数从 `@/lib/utils` 引入 `cn`；shadcn 原语从 `@/components/ui/<x>` 引入（安装时 CLI 会改写别名）
   - 文件里的说明注释用中文
2. **登记到 `registry.json`**（根目录）
   - `name`（kebab-case）、`type`、`title`、`description`（中文）
   - `dependencies`：npm 包；`registryDependencies`：shadcn 组件名，或本站的完整 URL / `@travinsy/<name>`
   - `files[].path`；页面模板文件必须写 `target`（如 `app/page.tsx`）
   - 用到 `src/styles/grid.css` 工具类或新的 CSS 变量时，写进 `css` / `cssVars`
3. **写演示**：`src/registry/examples/<name>-demo.tsx`（默认导出一个组件），多个变体用 `<name>-<variant>-demo.tsx`
4. **写文档**：`content/docs/<components|blocks|templates>/<name>.mdx`，frontmatter 包含 `title`、`description`；正文使用文档组件（`ComponentPreview`、`InstallCommand` 等，以 `src/components/docs/` 中实际导出的为准）
5. **验证**
   ```bash
   source ~/.nvm/nvm.sh && nvm use
   pnpm registry:build && pnpm lint && pnpm build
   ```
   检查 `public/r/<name>.json` 已生成，内容包含源码。
   重要条目还要在临时项目里实际安装一次：
   `env -u ALL_PROXY -u all_proxy pnpm dlx shadcn@latest add http://localhost:3000/r/<name>.json`
