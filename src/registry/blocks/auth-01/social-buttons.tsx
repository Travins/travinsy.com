import type { SVGProps } from "react"

import { Button } from "@/components/ui/button"

export type SocialProvider = "github" | "google"

function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.81c.85 0 1.71.11 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  )
}

// 单色 G 标识：用 currentColor，不引入品牌多色，跟随主题
function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  )
}

const providers = {
  github: { label: "GitHub", Icon: GitHubIcon },
  google: { label: "Google", Icon: GoogleIcon },
} as const

/** 第三方登录按钮行：点击后交给 onSelect，pending 时全部禁用。 */
export function SocialButtons({
  providers: enabled,
  pending,
  onSelect,
}: {
  providers: readonly SocialProvider[]
  pending: boolean
  onSelect: (provider: SocialProvider) => void
}) {
  if (!enabled.length) return null
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${enabled.length}, minmax(0, 1fr))` }}>
      {enabled.map((provider) => {
        const { label, Icon } = providers[provider]
        return (
          <Button
            key={provider}
            type="button"
            variant="outline"
            className="h-10"
            disabled={pending}
            onClick={() => onSelect(provider)}
          >
            <Icon data-icon="inline-start" />
            {label}
          </Button>
        )
      })}
    </div>
  )
}
