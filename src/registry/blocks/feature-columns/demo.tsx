import { Bot, Code2, Server } from "lucide-react"

import { GridContainer } from "@/registry/ui/grid-layout/grid-layout"

import { FeatureColumns } from "./feature-columns"

export default function FeatureColumnsDemo() {
  return (
    <GridContainer>
      <FeatureColumns
        title="我在做什么"
        items={[
          {
            title: "全栈开发",
            description: "从前端界面到后端服务，构建完整、可靠的产品体验。",
            icon: <Code2 strokeWidth={1.5} />,
          },
          {
            title: "AI 应用与 Agent",
            description: "连接模型、工具与业务流程，让 AI 进入真实的工作场景。",
            icon: <Bot strokeWidth={1.5} />,
          },
          {
            title: "大模型部署",
            description: "关注推理服务与部署优化，把模型能力变成可用的基础设施。",
            icon: <Server strokeWidth={1.5} />,
          },
        ]}
      />
    </GridContainer>
  )
}
