import type { CSSProperties, ReactNode } from "react"
import {
  siDocker,
  siFastapi,
  siKubernetes,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siPytorch,
  siReact,
  siTypescript,
  siVllm,
} from "simple-icons"

type TechIconData = { hex: string; viewBox: string; svg: ReactNode }

function fromSimpleIcon(icon: { hex: string; path: string }): TechIconData {
  return {
    hex: icon.hex,
    viewBox: "0 0 24 24",
    svg: <path d={icon.path} fill="currentColor" />,
  }
}

// simple-icons 没有收录 SGLang，按官方仓库 assets/logo_square.svg 的矢量路径重绘（去掉方框里的位图字符）
const sglang: TechIconData = {
  hex: "A5300F",
  viewBox: "0 0 596 683",
  svg: (
    <g fill="none" stroke="currentColor" strokeWidth={56}>
      <path d="M482.9 195.5c0 87.5-103.3 175.1-206.7 175.1" />
      <path d="M195.3 316.5c67.3 0 134.6 100.5 134.6 201.1" />
      <circle cx="112.8" cy="316" r="82.5" />
      <circle cx="482.8" cy="113" r="82.5" />
      <rect x="237.3" y="517.5" width="185" height="131" rx="22" />
    </g>
  ),
}

const techIcons: Record<string, TechIconData> = {
  TypeScript: fromSimpleIcon(siTypescript),
  React: fromSimpleIcon(siReact),
  "Next.js": fromSimpleIcon(siNextdotjs),
  "Node.js": fromSimpleIcon(siNodedotjs),
  Python: fromSimpleIcon(siPython),
  FastAPI: fromSimpleIcon(siFastapi),
  PyTorch: fromSimpleIcon(siPytorch),
  vLLM: fromSimpleIcon(siVllm),
  SGLang: sglang,
  Docker: fromSimpleIcon(siDocker),
  Kubernetes: fromSimpleIcon(siKubernetes),
  PostgreSQL: fromSimpleIcon(siPostgresql),
}

function isTooDark(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 40
}

/**
 * 悬停时用 --brand 显示品牌原色。品牌色是外部固定值，不随颜色主题变化；
 * 接近纯黑的（如 Next.js）改用前景色，避免暗色模式下看不见。
 */
function techBrandStyle(name: string): CSSProperties {
  const icon = techIcons[name]
  const brand =
    !icon || isTooDark(icon.hex) ? "var(--foreground)" : `#${icon.hex}`
  return { "--brand": brand } as CSSProperties
}

function TechIcon({ name, className }: { name: string; className?: string }) {
  const icon = techIcons[name]
  if (!icon) {
    return (
      <span aria-hidden="true" className="font-mono text-[10px]">
        {name.slice(0, 2)}
      </span>
    )
  }
  return (
    <svg viewBox={icon.viewBox} aria-hidden="true" className={className}>
      {icon.svg}
    </svg>
  )
}

export { TechIcon, techBrandStyle }
