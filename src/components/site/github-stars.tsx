"use client"

import { useEffect, useState } from "react"

import { IconTip } from "@/components/docs/icon-tip"
import { GithubIcon } from "@/components/site/github-icon"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** 站内接口：服务端每 10 分钟向 GitHub 取一次，浏览器不直接访问 GitHub，不受匿名额度限制 */
const STARS_ENDPOINT = "/api/github-stars/"

/** 1234 → 1.2K；悬停提示里再给完整数字 */
const formatStars = (count: number) =>
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(count)

/** 完整数字加 GitHub 的说法：1 star、2,407 stars */
const starsText = (count: number) =>
  `${count.toLocaleString("en")} ${count === 1 ? "star" : "stars"}`

/**
 * 页头的 GitHub 链接：图标 + 星标数。
 * 首屏用构建时读到的数（initial），挂载后向站内接口取一次最新值；请求失败就保持构建时的数，构建时也没拿到则只显示图标。
 * 页头在站内跳转时不会重新挂载，所以每次打开站点只请求一次。
 */
export function GithubStars({
  href,
  initial,
}: {
  href: string
  initial: number | null
}) {
  const [stars, setStars] = useState(initial)

  useEffect(() => {
    const controller = new AbortController()
    fetch(STARS_ENDPOINT, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { stars?: unknown } | null) => {
        if (typeof data?.stars === "number") setStars(data.stars)
      })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  const label =
    stars === null ? "GitHub 仓库" : `GitHub 仓库，${starsText(stars)}`

  const link = (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={cn(
        buttonVariants({
          variant: "ghost",
          size: stars === null ? "icon" : "default",
        }),
        // 窄屏只留图标，宽度与其他图标按钮一致
        stars !== null && "max-sm:w-8 max-sm:px-0",
      )}
    >
      <GithubIcon />
      {stars !== null ? (
        <span
          aria-hidden="true"
          className="font-mono text-xs text-muted-foreground tabular-nums max-sm:hidden"
        >
          {formatStars(stars)}
        </span>
      ) : null}
    </a>
  )

  // 悬停 / 聚焦时显示完整数字，例如「2,407 stars」
  return (
    <IconTip label={stars === null ? "GitHub 仓库" : starsText(stars)}>
      {link}
    </IconTip>
  )
}
