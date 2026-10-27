import {
  ShuffleGrid,
  ShuffleGridAvatar,
  type ShuffleGridGroup,
  type ShuffleGridItem,
} from "@/registry/ui/shuffle-grid/shuffle-grid"

// 全是虚构的名字，头像只用首字
const PEOPLE = [
  { id: "mia", name: "Mia", tone: "blue" },
  { id: "zhou", name: "周屿", tone: "violet" },
  { id: "noah", name: "Noah", tone: "cyan" },
  { id: "chen", name: "陈默", tone: "green" },
  { id: "kai", name: "Kai", tone: "amber" },
  { id: "su", name: "苏晴", tone: "rose" },
  { id: "leo", name: "Leo", tone: "blue" },
  { id: "he", name: "何川", tone: "violet" },
  { id: "eva", name: "Eva", tone: "cyan" },
] as const

const MEMBERS: ShuffleGridItem[] = PEOPLE.map((person) => ({
  id: person.id,
  tone: person.tone,
  content: <ShuffleGridAvatar name={person.name} className="size-9" />,
}))

// 同一个人会出现在几个分类里，切换分类时他们是换位，不是消失再出现
const TEAMS: ShuffleGridGroup[] = [
  { id: "frontend", label: "前端", items: ["mia", "zhou", "kai", "su", "eva"] },
  { id: "design", label: "设计", items: ["su", "noah", "mia"] },
  {
    id: "backend",
    label: "后端",
    items: ["chen", "leo", "he", "kai", "eva", "noah"],
  },
  { id: "ops", label: "运维", items: ["he", "leo", "zhou"] },
]

export default function ShuffleGridTeamDemo() {
  return (
    <ShuffleGrid
      label="团队成员的首字母头像，按前端、设计、后端、运维分类在方格中换位"
      variant="tiles"
      items={MEMBERS}
      groups={TEAMS}
      litCount="all"
      groupInterval={3200}
      groupsLabel="团队分类"
      className="max-w-xs"
    />
  )
}
