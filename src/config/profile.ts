/** 首页与站点外壳用到的配置：首屏介绍 Yi UI 本身（个人维护的开源项目），维护者信息与联系方式也在这里；精选组件按 Registry 条目挑选。 */
export const profile = {
  /** 维护者，页头「BY …」署名用 */
  name: "Travins",
  brand: "Yi UI",
  /** 首屏介绍：组件库是什么、怎么用、谁在维护 */
  bio: "为中文界面打磨的 React 组件库，线条网格风格。用 shadcn CLI 把源码装进项目，从方条控件、图形动效到 AI 助手区块，默认文案和排版都按中文来，装完就是你自己的代码。由 Travins 个人维护，持续更新。",
  /** 首屏轮换的特性标签 */
  roles: ["方条控件", "图形与动效", "数据图表", "AI 助手区块", "页面模板"],
  /** 封面左上角的等宽小标题 */
  eyebrow: "OPEN SOURCE · MIT",
  location: "",
  timeZone: "",
  email: "travinsy@gmail.com",
  phone: "",
  website: "https://yiui.dev",
  websiteLabel: "yiui.dev",
  githubUsername: "Travins",
  socials: [
    { name: "X", icon: "x", href: "https://x.com/TravinsE" },
    // 指向组件库仓库 Yi UI，而不是个人主页
    { name: "GitHub", icon: "github", href: "https://github.com/Travins/yi-ui" },
    { name: "邮箱", icon: "mail", href: "mailto:travinsy@gmail.com" },
  ],
  focusAreas: [
    {
      title: "全栈开发",
      illustration: "fullstack",
      description: "从前端界面到后端服务，构建完整、可靠的产品体验。",
    },
    {
      title: "AI 应用与 Agent",
      illustration: "agent",
      description: "连接模型、工具与业务流程，让 AI 进入真实的工作场景。",
    },
    {
      title: "大模型部署",
      illustration: "deploy",
      description: "关注推理服务与部署优化，把模型能力变成可用的基础设施。",
    },
  ],
  // 每行 6 个：前端 / 服务端与运维 / 模型与推理 / AI 编程工具；href 为官网，在新窗口打开
  technologies: [
    { name: "TypeScript", href: "https://www.typescriptlang.org" },
    { name: "React", href: "https://react.dev" },
    { name: "Next.js", href: "https://nextjs.org" },
    { name: "Tailwind CSS", href: "https://tailwindcss.com" },
    { name: "shadcn/ui", href: "https://ui.shadcn.com" },
    { name: "AI SDK", href: "https://ai-sdk.dev" },
    { name: "Node.js", href: "https://nodejs.org" },
    { name: "Python", href: "https://www.python.org" },
    { name: "FastAPI", href: "https://fastapi.tiangolo.com" },
    { name: "PostgreSQL", href: "https://www.postgresql.org" },
    { name: "Docker", href: "https://www.docker.com" },
    { name: "Kubernetes", href: "https://kubernetes.io" },
    { name: "PyTorch", href: "https://pytorch.org" },
    { name: "vLLM", href: "https://vllm.ai" },
    { name: "SGLang", href: "https://sglang.io" },
    { name: "DeepSeek", href: "https://www.deepseek.com" },
    { name: "Qwen", href: "https://qwen.ai" },
    { name: "Grafana", href: "https://grafana.com" },
    { name: "Claude Code", href: "https://claude.com/product/claude-code" },
    { name: "Codex", href: "https://openai.com/codex" },
    { name: "Pi", href: "https://pi.dev" },
    { name: "Devin", href: "https://devin.ai" },
    { name: "T3 Code", href: "https://t3.codes" },
    { name: "Cursor", href: "https://cursor.com" },
  ],
  /**
   * 首页「精选组件」Bento：名称对应 registry.json 的条目，标题与链接都直接取自 Registry。
   * size 决定占的格子（宽屏六列两行）：side 2 列、wide 4 列（上行），half 3 列（下行平分）；平板两列各占一格，手机单列。
   * 顺序即网格的填充顺序；每个条目在 featured-bento.tsx 里要有对应的预览。
   */
  featuredComponents: [
    { name: "angle-dial", size: "side" },
    { name: "globe", size: "wide" },
    { name: "xy-pad", size: "half" },
    { name: "glyph-field", size: "half" },
  ],
} as const
