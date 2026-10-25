import { createSiteSearch } from "@/lib/search-index"

export const dynamic = "force-static"

export async function GET() {
  return createSiteSearch().staticGET()
}
