import { staticClient } from "fumadocs-core/search/client/orama-static"
import type { SortedResult } from "fumadocs-core/search"
import { SEARCH_INDEX_URL } from "@/lib/search"

const RECENT_KEY = "travinsy:search:recent"
const RECENT_MAX = 5

let attempt = 0
let indexReady = false

function createClient() {
  return staticClient({
    // fumadocs 按 URL 缓存下载结果（包括失败），重试时换一个查询串绕开缓存。
    from: attempt ? `${SEARCH_INDEX_URL}?retry=${attempt}` : SEARCH_INDEX_URL,
    search: { limit: 80, threshold: 0 },
  })
}

let client = createClient()

export function isIndexReady() {
  return indexReady
}

export function search(query: string): Promise<SortedResult[]> {
  return Promise.resolve(client.search(query))
}

/** 触发索引下载；下载成功后 isIndexReady() 为 true。 */
export async function warmIndex() {
  await search("")
  indexReady = true
}

export function retryIndex() {
  attempt += 1
  client = createClient()
  indexReady = false
}

export function readRecent(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]")
    return Array.isArray(value)
      ? value
          .filter((item): item is string => typeof item === "string")
          .slice(0, RECENT_MAX)
      : []
  } catch {
    return []
  }
}

export function writeRecent(items: string[]) {
  try {
    if (items.length) {
      localStorage.setItem(RECENT_KEY, JSON.stringify(items))
    } else {
      localStorage.removeItem(RECENT_KEY)
    }
  } catch {
    // 隐私模式等场景下 localStorage 不可用，忽略即可
  }
}

export function pushRecent(items: string[], query: string) {
  return [query, ...items.filter((item) => item !== query)].slice(0, RECENT_MAX)
}
