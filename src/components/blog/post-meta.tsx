import { formatBlogDate } from "@/lib/blog"

export function PostMeta({
  date,
  tags,
  minutes,
}: {
  date: string
  tags?: string[]
  minutes?: number
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-muted-foreground">
      <time dateTime={date}>{formatBlogDate(date)}</time>
      {minutes !== undefined && <span>约 {minutes} 分钟</span>}
      {tags?.map((tag) => (
        <span key={tag}>#{tag}</span>
      ))}
    </div>
  )
}
