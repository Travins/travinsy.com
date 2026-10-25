import { siteConfig } from "@/config/site"
import { blogPosts, source } from "@/lib/source"

export const absoluteUrl = (path: string) => {
  const url = new URL(path, `${siteConfig.url}/`)
  if (
    !url.pathname.endsWith("/") &&
    !url.pathname.split("/").pop()?.includes(".")
  ) {
    url.pathname += "/"
  }
  return url.href
}
export const docsPages = () => source.getPages(siteConfig.defaultLanguage)

export function sitemapPages() {
  return [
    ...new Set([
      "/",
      "/blog/",
      "/themes/",
      ...docsPages().map((page) => page.url),
      ...blogPosts().map((page) => page.url),
    ]),
  ]
}

export function escapeXml(value: string) {
  return value.replace(
    /[<>&"']/g,
    (character) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[character]!,
  )
}
