import { GITHUB_URL } from "@/components/site/site-config"

/** 仓库的 owner/name，从 GITHUB_URL 推出，例如 Travins/yi-ui */
export const GITHUB_REPO = new URL(GITHUB_URL).pathname.replace(/^\/|\/$/g, "")

/**
 * 读取仓库星标数。网络不通、超时或被限流时返回 null，调用方只显示图标，不让构建失败。
 * - 不传 revalidate：构建时读一次（页头首屏用，页面保持纯静态）
 * - 传 revalidate：按秒数定时刷新（/api/github-stars/ 用）
 * 配置了 GITHUB_TOKEN 时带上它，避免与同一出口 IP 的其他请求共用匿名额度。
 */
export async function getRepoStars(options?: {
  revalidate?: number
}): Promise<number | null> {
  const token = process.env.GITHUB_TOKEN
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: AbortSignal.timeout(5000),
        ...(options?.revalidate
          ? { next: { revalidate: options.revalidate } }
          : { cache: "force-cache" as const }),
      },
    )
    if (!response.ok) return null
    const data = (await response.json()) as { stargazers_count?: unknown }
    return typeof data.stargazers_count === "number"
      ? data.stargazers_count
      : null
  } catch {
    return null
  }
}
