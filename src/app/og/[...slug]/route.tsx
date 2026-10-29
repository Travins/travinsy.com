import { ogImage } from "@/lib/og"
import { ogCards } from "@/lib/og-cards"

export const dynamic = "force-static"
export const dynamicParams = false

// 最后一段带 .png 后缀（与 /md/ 同样的做法），静态导出后托管平台能按扩展名给出 image/png
const split = (key: string) => {
  const parts = key.split("/")
  return [...parts.slice(0, -1), `${parts.at(-1)}.png`]
}

let cards: ReturnType<typeof ogCards> | undefined
const getCards = () => (cards ??= ogCards())

/** /og/components/isometric-mark.png：构建时为每个页面生成 1200×630 的分享卡片 */
export function generateStaticParams() {
  return getCards().map((card) => ({ slug: split(card.key) }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params
  const key = [...slug.slice(0, -1), slug.at(-1)!.replace(/\.png$/, "")].join(
    "/",
  )
  const card = getCards().find((item) => item.key === key)
  if (!card) return new Response("Not Found", { status: 404 })
  return ogImage(card)
}
