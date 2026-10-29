import { getRepoStars } from "@/lib/github"

/** 每 10 分钟最多向 GitHub 请求一次，其余访问都命中 Vercel 的缓存 */
export const revalidate = 600

/** 页头 GitHub 按钮的实时星标数：{ "stars": 12 }，拿不到时为 null */
export async function GET() {
  const stars = await getRepoStars({ revalidate })
  return Response.json({ stars })
}
