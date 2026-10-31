import { entryTitleEn } from "@/lib/source"

/** 首页卡片标题：英文名为主（更直观），中文名小一号放在下一行；没有英文名时只显示中文。 */
function EntryTitle({
  section,
  name,
  title,
}: {
  section: "components" | "blocks" | "pages"
  name: string
  title: string
}) {
  const titleEn = entryTitleEn(section, name)
  if (!titleEn) return <>{title}</>
  return (
    <>
      <span lang="en" translate="no">
        {titleEn}
      </span>
      <span className="mt-0.5 block text-[13px] font-normal text-muted-foreground">
        {title}
      </span>
    </>
  )
}

export { EntryTitle }
