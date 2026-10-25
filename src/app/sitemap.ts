import type { MetadataRoute } from "next"
import { absoluteUrl, sitemapPages } from "@/lib/site-content"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapPages().map((path) => ({ url: absoluteUrl(path) }))
}
