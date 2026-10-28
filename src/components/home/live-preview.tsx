"use client"

import { useEffect, useRef, useState } from "react"

/**
 * 区块 / 模板的缩小实时预览：用 `/view/<name>/` 页面的 iframe，等比缩小后铺满画框。
 * iframe 要等画框靠近视口（预留 200px）才挂载，首屏阶段不会请求任何一个；挂载后再交给浏览器的 `loading="lazy"`。
 * 整块对读屏与键盘隐藏、不响应指针，点击由外层卡片的链接接管。
 *
 * 缩放用百分比宽高加 `scale`，不依赖容器查询：画框宽度随断点变化，各断点的缩放比取一个让页面按桌面布局渲染的值。
 */
function LivePreview({ name, title }: { name: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setNear(true)
        observer.disconnect()
      },
      { rootMargin: "200px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      inert
      className="pointer-events-none relative aspect-[16/10] overflow-hidden bg-muted/20"
    >
      {near ? (
        <iframe
          src={`/view/${name}/`}
          title={`${title} 缩略预览`}
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 h-[400%] w-[400%] origin-top-left scale-25 border-0 bg-background sm:h-[222.222%] sm:w-[222.222%] sm:scale-[0.45] md:h-[400%] md:w-[400%] md:scale-25 lg:h-[285.714%] lg:w-[285.714%] lg:scale-[0.35] xl:h-[250%] xl:w-[250%] xl:scale-[0.4]"
        />
      ) : null}
    </div>
  )
}

export { LivePreview }
