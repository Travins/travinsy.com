import {
  siDocker,
  siFastapi,
  siKubernetes,
  siNextdotjs,
  siNodedotjs,
  siOllama,
  siPostgresql,
  siPython,
  siPytorch,
  siReact,
  siTypescript,
  siVllm,
  type SimpleIcon,
} from "simple-icons"

// 只取路径、统一用 currentColor 单色渲染：品牌色是硬编码颜色，会破坏颜色主题切换
const techIcons: Record<string, SimpleIcon> = {
  TypeScript: siTypescript,
  React: siReact,
  "Next.js": siNextdotjs,
  "Node.js": siNodedotjs,
  Python: siPython,
  FastAPI: siFastapi,
  PyTorch: siPytorch,
  vLLM: siVllm,
  Ollama: siOllama,
  Docker: siDocker,
  Kubernetes: siKubernetes,
  PostgreSQL: siPostgresql,
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
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d={icon.path} />
    </svg>
  )
}

export { TechIcon }
