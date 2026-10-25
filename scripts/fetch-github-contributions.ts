import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { profile } from "../src/config/profile"

const destination = resolve(process.cwd(), "src/data/github-contributions.json")
const username = profile.githubUsername

async function main() {
  try {
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
      { signal: AbortSignal.timeout(15_000) },
    )
    if (!response.ok) throw new Error(`接口返回 ${response.status}`)
    const body: unknown = await response.json()
    if (
      !body ||
      typeof body !== "object" ||
      !("contributions" in body) ||
      !Array.isArray(body.contributions)
    )
      throw new Error("接口数据格式不正确")
    const contributions = body.contributions
      .map((entry: unknown) => {
        if (
          !entry ||
          typeof entry !== "object" ||
          !("date" in entry) ||
          !("count" in entry) ||
          !("level" in entry) ||
          typeof entry.date !== "string" ||
          !/^\d{4}-\d{2}-\d{2}$/.test(entry.date) ||
          !Number.isFinite(Date.parse(entry.date)) ||
          typeof entry.count !== "number" ||
          !Number.isFinite(entry.count) ||
          entry.count < 0 ||
          typeof entry.level !== "number" ||
          !Number.isInteger(entry.level) ||
          entry.level < 0 ||
          entry.level > 4
        )
          throw new Error("贡献记录格式不正确")
        return { date: entry.date, count: entry.count, level: entry.level }
      })
      .sort((a, b) => a.date.localeCompare(b.date))
    await mkdir(dirname(destination), { recursive: true })
    await writeFile(
      destination,
      JSON.stringify(
        { username, fetchedAt: new Date().toISOString(), contributions },
        null,
        2,
      ) + "\n",
    )
    console.log(
      `已写入 ${contributions.length} 天的 GitHub 贡献数据：${destination}`,
    )
  } catch (error) {
    console.warn(
      "GitHub 贡献数据获取失败，使用本地兜底：",
      error instanceof Error ? error.message : String(error),
    )
    try {
      const previous = JSON.parse(await readFile(destination, "utf8"))
      if (
        previous.username === username &&
        Array.isArray(previous.contributions)
      )
        return
    } catch {
      /* 首次构建没有缓存时生成空数据。 */
    }
    await mkdir(dirname(destination), { recursive: true })
    await writeFile(
      destination,
      JSON.stringify(
        { username, fetchedAt: null, contributions: [] },
        null,
        2,
      ) + "\n",
    )
  }
}

void main()
