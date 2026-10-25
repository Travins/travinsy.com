import { GridContainer } from "@/registry/ui/grid-layout/grid-layout"

import { ProfileHero } from "./profile-hero"

export default function ProfileHeroDemo() {
  return (
    <GridContainer>
      <ProfileHero
        name="Your Name"
        initials="Y"
        bio="全栈开发者，专注 AI 应用与产品体验。从界面到服务，把想法做成可用的东西。"
        roles={["全栈开发", "AI Agent 开发", "组件设计"]}
      />
    </GridContainer>
  )
}
