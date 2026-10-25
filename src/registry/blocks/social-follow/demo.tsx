import { Mail } from "lucide-react"

import { GridContainer } from "@/registry/ui/grid-layout/grid-layout"

import { GitHubMark, XMark } from "./brand-icons"
import { SocialFollow } from "./social-follow"

export default function SocialFollowDemo() {
  return (
    <GridContainer className="mt-8">
      <SocialFollow
        socials={[
          { name: "GitHub", href: "https://github.com", icon: <GitHubMark /> },
          { name: "X", href: "https://x.com", icon: <XMark /> },
          {
            name: "邮件",
            href: "mailto:hi@example.com",
            icon: <Mail strokeWidth={1.5} />,
          },
        ]}
      />
    </GridContainer>
  )
}
