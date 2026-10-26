import type * as React from "react"

// 站点标志：抽象「易」——终端窗口（日）+ 三道斜撇与箭头（勿）。源稿见 design/logo/final-yi/
export function SiteLogo(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 332 332" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M60 0 315 0 315 281 264 332 264 232 164 332 133 301 264 170 226 170 64 332 33 301 164 170 126 170 17 279 17 217 64 170 17 170 17 43ZM85 43 123 43 163 83 123 123 85 123 125 83ZM174 101 235 101 235 123 174 123Z"
      />
    </svg>
  )
}
