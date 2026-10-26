/** 个人信息统一配置；私密联系信息默认留空，精选组件按 Registry 条目挑选。 */
export const profile = {
  name: "Travins",
  brand: "travinsy",
  bio: "全栈开发者，专注 AI 应用与大模型落地。从界面到推理服务，把想法做成可用的产品。",
  roles: ["全栈开发", "AI Agent 开发", "大模型部署", "组件设计"],
  /** 封面左上角的小标题，像规格书的文档标题栏 */
  eyebrow: "PROFILE / 个人规格书",
  /** 封面右侧终端卡片：依次打出命令，再显示输出 */
  terminal: {
    title: "travins@dev ~",
    steps: [
      { command: "whoami", output: ["travins — 全栈开发者"] },
      {
        command: "ls ./focus",
        output: ["fullstack  ai-agents  llm-deploy"],
      },
      {
        command: "deploy --model qwen3 --gpu 2",
        output: ["✓ ready on :8000"],
      },
    ],
  },
  location: "",
  timeZone: "",
  email: "",
  phone: "",
  website: "https://travinsy.com",
  websiteLabel: "travinsy.com",
  githubUsername: "Travins",
  socials: [
    { name: "X", icon: "x", href: "https://x.com/TravinsE" },
    { name: "GitHub", icon: "github", href: "https://github.com/Travins" },
  ],
  focusAreas: [
    {
      title: "全栈开发",
      icon: "code",
      description: "从前端界面到后端服务，构建完整、可靠的产品体验。",
    },
    {
      title: "AI 应用与 Agent",
      icon: "agent",
      description: "连接模型、工具与业务流程，让 AI 进入真实的工作场景。",
    },
    {
      title: "大模型部署",
      icon: "server",
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
   * 首页「精选组件」：名称对应 registry.json 的条目，
   * 标题、描述与链接都直接取自 Registry，避免再维护一份文案。
   */
  featuredComponents: [
    "grid-layout",
    "contribution-graph",
    "local-time",
    "icon-link",
  ],
  about: [
    "你好，我是 Travins，travinsy.com 是我的个人站。我关注全栈开发、AI 应用与大模型部署，也喜欢把反复用到的界面细节整理成组件。",
    "相信好用的工具来自清晰的结构和耐心的打磨。在这里分享自己的实践，也把用得顺手的组件开源出来。",
  ],
} as const
