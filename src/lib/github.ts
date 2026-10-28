import { GITHUB_URL } from "@/components/site/site-config"

/** 仓库的 owner/name，从 GITHUB_URL 推出，例如 Travins/yi-ui */
export const GITHUB_REPO = new URL(GITHUB_URL).pathname.replace(/^\/|\/$/g, "")

/**
 * 构建时读取仓库星标数。静态导出只在构建时执行一次；
 * 网络不通、超时或被限流时返回 null，页头只显示图标，不让构建失败。
 */
export async function getRepoStars(): Promise<number | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}`,
      {
        headers: { Accept: "application/vnd.github+json" },
        signal: AbortSignal.timeout(5000),
        cache: "force-cache",
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
