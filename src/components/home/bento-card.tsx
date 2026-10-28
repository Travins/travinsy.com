import Link from "next/link"
import { useId, type ComponentProps, type ReactNode } from "react"
import { ArrowUpRight } from "lucide-react"

/**
 * Bento 里的一张卡：上面是组件的实时预览，底部是标题行。
 * 预览保持组件自身的交互（悬停、点击都生效），只有标题行是进入文档的链接：
 * 链接铺满标题行，悬停或聚焦它时顶边亮起一条主色细线、箭头抬起。
 */
function BentoCard({
  href,
  label,
  preview,
  previewClassName,
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof Link>, "href" | "children"> & {
  href: string
  /** 预览区的读屏名称，如「地球演示」 */
  label: string
  /** 组件的实时预览 */
  preview: ReactNode
  /** 预览区在窄屏下的高度等样式；宽屏由网格行高决定 */
  previewClassName?: string
  /** 标题，由服务端渲染后传入 */
  children: ReactNode
}) {
  const titleId = useId()

  return (
    <div
      data-slot="bento-card"
      className={`group/card relative flex h-full min-w-0 flex-col ${className ?? ""}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 ease-out group-has-[a:focus-visible]/card:scale-x-100 group-has-[a:hover]/card:scale-x-100 motion-reduce:transition-none"
      />
      <div
        role="group"
        aria-label={label}
        className={`relative min-h-0 flex-auto overflow-clip lg:flex-1 ${previewClassName ?? ""}`}
      >
        {preview}
      </div>
      <div className="group/link relative flex items-start justify-between gap-3 border-t border-edge px-4 py-3 transition-colors has-[a:focus-visible]:bg-muted/30 has-[a:hover]:bg-muted/30 sm:px-5">
        <h3
          id={titleId}
          className="text-sm font-medium tracking-tight group-has-[a:focus-visible]/link:text-primary group-has-[a:hover]/link:text-primary"
        >
          {children}
        </h3>
        <ArrowUpRight
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform motion-safe:group-has-[a:hover]/link:-translate-y-0.5 motion-safe:group-has-[a:hover]/link:translate-x-0.5"
        />
        {/* 只有标题行是链接：上方的预览可以直接操作，不会误触跳转 */}
        <Link
          href={href}
          aria-labelledby={titleId}
          className="absolute inset-0 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring"
          {...props}
        />
      </div>
    </div>
  )
}

export { BentoCard }
