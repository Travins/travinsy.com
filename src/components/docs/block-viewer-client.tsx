"use client"
import {
  ExternalLink,
  File,
  Monitor,
  Smartphone,
  Tablet,
  Terminal,
} from "lucide-react"
import {
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react"
import { buttonVariants, Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type ViewerFile = { path: string; code: ReactNode }
type TreeNode = { name: string; path?: string; children: TreeNode[] }

const MIN_WIDTH = 320
const presets = [
  { id: "desktop", label: "桌面", width: null, Icon: Monitor },
  { id: "tablet", label: "平板", width: 768, Icon: Tablet },
  { id: "mobile", label: "手机", width: 375, Icon: Smartphone },
] as const

// 把 components/a/b.tsx 这样的目标路径折叠成文件树
function buildTree(files: ViewerFile[]) {
  const root: TreeNode = { name: "", children: [] }
  for (const file of files) {
    let node = root
    const parts = file.path.split("/")
    parts.forEach((part, index) => {
      let child = node.children.find((entry) => entry.name === part)
      if (!child) {
        child = { name: part, children: [] }
        node.children.push(child)
      }
      if (index === parts.length - 1) child.path = file.path
      node = child
    })
  }
  return root.children
}

function FileTree({
  nodes,
  active,
  onSelect,
}: {
  nodes: TreeNode[]
  active: string
  onSelect: (path: string) => void
}) {
  return (
    <ul className="flex flex-col gap-0.5">
      {nodes.map((node) => (
        <li key={node.path ?? node.name}>
          {node.path ? (
            <button
              type="button"
              onClick={() => onSelect(node.path!)}
              aria-current={node.path === active ? "true" : undefined}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left font-mono text-xs text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-[current=true]:bg-muted aria-[current=true]:text-foreground"
            >
              <File aria-hidden="true" className="size-3.5 shrink-0" />
              <span className="min-w-0 break-all">{node.name}</span>
            </button>
          ) : (
            <div className="mt-1">
              <p className="px-2 py-1 font-mono text-xs text-muted-foreground/70">
                {node.name}/
              </p>
              <div className="ml-2 border-l border-edge pl-1">
                <FileTree
                  nodes={node.children}
                  active={active}
                  onSelect={onSelect}
                />
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

export function BlockViewerClient({
  name,
  title,
  height,
  files,
  install,
}: {
  name: string
  title: string
  height: string
  files: ViewerFile[]
  install: ReactNode
}) {
  const [view, setView] = useState("preview")
  // null 表示跟随容器宽度（桌面）
  const [width, setWidth] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)
  const [installOpen, setInstallOpen] = useState(false)
  const [active, setActive] = useState(files[0]?.path ?? "")
  const tree = useMemo(() => buildTree(files), [files])
  const stageRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; width: number } | null>(null)

  const clamp = (value: number) =>
    Math.round(
      Math.min(
        Math.max(value, MIN_WIDTH),
        stageRef.current?.clientWidth ?? value,
      ),
    )
  // 预览框居中，拖右边缘时左右各变化一半，所以位移乘以 2 才能让边缘跟手
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!frameRef.current) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { x: event.clientX, width: frameRef.current.offsetWidth }
    setDragging(true)
  }
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    setWidth(clamp(drag.current.width + (event.clientX - drag.current.x) * 2))
  }
  const onPointerUp = () => {
    drag.current = null
    setDragging(false)
  }
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = frameRef.current?.offsetWidth
    if (!current) return
    const step = event.shiftKey ? 64 : 16
    if (event.key === "ArrowLeft") setWidth(clamp(current - step))
    else if (event.key === "ArrowRight") setWidth(clamp(current + step))
    else if (event.key === "Home") setWidth(null)
    else return
    event.preventDefault()
  }

  return (
    <Tabs
      value={view}
      onValueChange={(value) => setView(String(value))}
      className="not-prose my-6 min-w-0 gap-0 overflow-hidden rounded-lg border border-edge"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-edge bg-muted/40 px-2 py-1.5">
        <TabsList aria-label={`${title} 查看方式`}>
          <TabsTrigger value="preview">预览</TabsTrigger>
          <TabsTrigger value="code">代码</TabsTrigger>
        </TabsList>
        <div
          role="group"
          aria-label="预览宽度"
          className={cn(
            "hidden items-center gap-1 sm:flex",
            view !== "preview" && "sm:hidden",
          )}
        >
          {presets.map(({ id, label, width: presetWidth, Icon }) => (
            <Button
              key={id}
              variant="ghost"
              size="icon-sm"
              aria-label={`${label}宽度`}
              aria-pressed={width === presetWidth}
              title={presetWidth ? `${label} ${presetWidth}px` : label}
              onClick={() => setWidth(presetWidth)}
              className="aria-pressed:bg-muted aria-pressed:text-foreground"
            >
              <Icon aria-hidden="true" />
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={installOpen}
            onClick={() => setInstallOpen((open) => !open)}
          >
            <Terminal aria-hidden="true" data-icon="inline-start" />
            安装
          </Button>
          <a
            href={`/view/${name}/`}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <ExternalLink aria-hidden="true" data-icon="inline-start" />
            新标签打开
            <span className="sr-only">（在新标签页中打开）</span>
          </a>
        </div>
      </div>
      {installOpen && (
        <div className="border-b border-edge px-4 py-2">{install}</div>
      )}
      <TabsContent value="preview" keepMounted>
        <div
          ref={stageRef}
          className="bg-hatch flex justify-center sm:px-4"
        >
          <div
            ref={frameRef}
            className={cn(
              "relative max-w-full bg-background sm:border-x sm:border-edge",
              !dragging && "transition-[width] duration-200 motion-reduce:transition-none",
            )}
            style={{ width: width ?? "100%" }}
          >
            <iframe
              src={`/view/${name}/`}
              title={`${title} 预览`}
              loading="lazy"
              className={cn("block w-full border-0", dragging && "pointer-events-none")}
              style={{ height }}
            />
            <div
              role="separator"
              tabIndex={0}
              aria-orientation="vertical"
              aria-label="拖拽或用左右方向键调整预览宽度，Home 恢复"
              aria-valuenow={width ?? undefined}
              aria-valuemin={MIN_WIDTH}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onKeyDown={onKeyDown}
              className="group absolute inset-y-0 -right-4 hidden w-4 cursor-ew-resize touch-none items-center justify-center outline-none sm:flex"
            >
              <span className="h-10 w-1 rounded-full bg-edge transition-colors group-hover:bg-muted-foreground group-focus-visible:bg-ring" />
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="code" keepMounted>
        <div className="grid md:grid-cols-[15rem_minmax(0,1fr)]">
          <nav
            aria-label="文件"
            className="border-b border-edge p-2 md:border-r md:border-b-0"
          >
            <FileTree nodes={tree} active={active} onSelect={setActive} />
          </nav>
          <div className="min-w-0 md:max-h-[44rem] md:overflow-auto">
            {files.map((file) => (
              <div
                key={file.path}
                hidden={file.path !== active}
                className="[&_.docs-code]:my-0 [&_.docs-code]:rounded-none [&_.docs-code]:border-0"
              >
                {file.code}
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
