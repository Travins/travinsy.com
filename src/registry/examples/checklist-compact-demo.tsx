import {
  Checklist,
  ChecklistItem,
  ChecklistList,
} from "@/registry/ui/checklist/checklist"

const ITEMS = [
  { label: "护照与签证", done: true },
  { label: "充电器和转换插头", done: true },
  { label: "下载离线地图", done: false },
  { label: "兑换少量现金", done: false },
]

// `size="sm"` 的紧凑款，适合塞进侧栏或小卡片；划线颜色换成玫红，像红笔批改
export default function ChecklistCompactDemo() {
  return (
    <div className="w-full max-w-xs rounded-lg border border-edge bg-card p-4">
      <Checklist size="sm" tone="rose" className="gap-2">
        <p className="text-xs font-medium text-muted-foreground">出发前检查</p>
        <ChecklistList>
          {ITEMS.map((item) => (
            <ChecklistItem key={item.label} defaultChecked={item.done}>
              {item.label}
            </ChecklistItem>
          ))}
        </ChecklistList>
      </Checklist>
    </div>
  )
}
