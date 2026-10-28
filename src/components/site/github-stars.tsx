"use client"

import { useEffect, useState } from "react"

import { IconTip } from "@/components/docs/icon-tip"
import { GithubIcon } from "@/components/site/github-icon"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const CACHE_KEY = "travinsy:github-stars"
/** 浏览器里缓存 30 分钟：GitHub 匿名接口每个 IP 每小时只有 60 次额度，不必每换一页都请求 */
const CACHE_TTL = 30 * 60 * 1000

/** 1234 → 1.2K；悬停提示里再给完整数字 */
const formatStars = (count: number) =>
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(count)

/** 完整数字加 GitHub 的说法：1 star、2,407 stars */
const starsText = (count: number) =>
  `${count.toLocaleString("en")} ${count === 1 ? "star" : "stars"}`

function readCache(): number | null {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? "null") as {
      count: number
      at: number
    } | null
    return cached && Date.now() - cached.at < CACHE_TTL ? cached.count : null
  } catch {
    return null
  }
}

/**
 * 页头的 GitHub 链接：图标 + 星标数。
 * 首屏用构建时读到的数（initial），挂载后再静默请求一次最新值；请求失败就保持构建时的数，构建时也没拿到则只显示图标。
 */
export function GithubStars({
  href,
  repo,
  initial,
}: {
  href: string
  repo: string
  initial: number | null
}) {
  const [stars, setStars] = useState(initial)

  useEffect(() => {
    const controller = new AbortController()
    const cached = readCache()
    const request: Promise<number | null> =
      cached !== null
        ? Promise.resolve(cached)
        : fetch(`https://api.github.com/repos/${repo}`, {
            headers: { Accept: "application/vnd.github+json" },
            signal: controller.signal,
          })
            .then((response) => (response.ok ? response.json() : null))
            .then((data: { stargazers_count?: unknown } | null) => {
              if (typeof data?.stargazers_count !== "number") return null
              try {
                sessionStorage.setItem(
                  CACHE_KEY,
                  JSON.stringify({
                    count: data.stargazers_count,
                    at: Date.now(),
                  }),
                )
              } catch {
                // 存储不可用时只是每次都请求，不影响显示
              }
              return data.stargazers_count
            })
    request
      .then((count) => {
        if (count !== null && !controller.signal.aborted) setStars(count)
      })
      .catch(() => {})
    return () => controller.abort()
  }, [repo])

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
