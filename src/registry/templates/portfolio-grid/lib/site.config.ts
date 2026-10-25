/**
 * 个人主页的全部内容都集中在这个文件：改完保存，整页同步更新。
 * 颜色请通过主题变量（globals.css）调整，不要在组件里硬编码。
 */

/** 社交链接支持的图标：github / x / mail / link */
export type SocialIcon = "github" | "x" | "mail" | "link"
/** 「我在做什么」支持的图标：code / bot / server / layout */
export type FocusIcon = "code" | "bot" | "server" | "layout"

export const siteConfig = {
  name: "Your Name",
  /** 头像方块里显示的缩写，1–2 个字符 */
  initials: "Y",
  /** 横幅中间的装饰文字，设为空字符串可隐藏 */
  tagline: "DESIGN · CODE · REPEAT",
  bio: "全栈开发者，专注 AI 应用与产品体验。从界面到服务，把想法做成可用的东西。",
  /** 职业标签，在封面区依次轮播 */
  roles: ["全栈开发", "AI 应用", "界面设计"],
  /** 页头的锚点导航，href 对应各区块的 id */
  nav: [
    { label: "做什么", href: "#focus" },
    { label: "技术栈", href: "#stack" },
    { label: "关于", href: "#about" },
  ],
  socials: [
    { name: "GitHub", icon: "github", href: "https://github.com/your-name" },
    { name: "X", icon: "x", href: "https://x.com/your-name" },
    { name: "邮件", icon: "mail", href: "mailto:hi@example.com" },
  ] satisfies { name: string; icon: SocialIcon; href: string }[],
  focus: {
    title: "我在做什么",
    items: [
      {
        title: "全栈开发",
        icon: "code",
        description: "从前端界面到后端服务，构建完整、可靠的产品体验。",
      },
      {
        title: "AI 应用与 Agent",
        icon: "bot",
        description: "连接模型、工具与业务流程，让 AI 进入真实的工作场景。",
      },
      {
        title: "界面系统",
        icon: "layout",
        description: "把反复用到的界面细节整理成可复制的组件。",
      },
    ] satisfies { title: string; icon: FocusIcon; description: string }[],
  },
  stack: {
    title: "技术栈",
    items: [
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Tailwind CSS",
      "PostgreSQL",
      "Docker",
      "Python",
    ],
  },
  about: {
    title: "关于我",
    paragraphs: [
      "你好，我是 Your Name。这里是我的个人主页，记录作品，也记录那些值得反复打磨的小想法。",
      "相信好用的工具来自清晰的结构和耐心的打磨。持续学习，慢慢构建。",
    ],
  },
  /** 页脚的版权年份；写成固定文本，兼容 Next.js 的 Cache Components */
  year: "2026",
  footer: "用线条网格搭建",
}

export type SiteConfig = typeof siteConfig
