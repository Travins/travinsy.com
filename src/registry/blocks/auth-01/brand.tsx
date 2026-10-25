import { Gauge, Hexagon, ShieldCheck, Zap } from "lucide-react"
import type { ReactNode } from "react"

export type BrandFeature = {
  icon: ReactNode
  title: string
  description: string
}

export type BrandConfig = {
  /** 产品名，显示在 Logo 旁 */
  name: string
  /** Logo 节点：建议用 currentColor 的 SVG，这样在品牌面板（反色）和表单上方（正常色）都能看清 */
  logo: ReactNode
  /** 品牌面板的大标题 */
  title: string
  description: string
  /** 品牌面板上的特性列表，建议 2–3 条 */
  features: BrandFeature[]
  /** 右下角的版权文字 */
  copyright: string
}

/** 示例品牌：换成自己的产品信息，或通过 Auth01 的 brand 属性逐项覆盖。 */
export const defaultBrand: BrandConfig = {
  name: "Acme",
  logo: <Hexagon strokeWidth={1.5} />,
  title: "把想法变成可用的产品",
  description: "一个账号，打开全部工具。登录后继续上次的工作，随时随地保持同步。",
  features: [
    {
      icon: <Zap />,
      title: "快速上手",
      description: "几分钟完成配置，立刻开始使用",
    },
    {
      icon: <Gauge />,
      title: "稳定可靠",
      description: "全天候运行，关键数据实时同步",
    },
    {
      icon: <ShieldCheck />,
      title: "安全优先",
      description: "加密传输，权限精细可控",
    },
  ],
  copyright: "© 2026 Acme. 保留所有权利。",
}
