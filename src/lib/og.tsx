import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

export const ogSize = { width: 1200, height: 630 }

// 分享卡片是构建时生成的 PNG，Satori 不认 CSS 变量与 oklch，这里的颜色是与亮色主题 token 对应的固定十六进制值
const color = {
  bg: "#ffffff",
  fg: "#0a0a0a",
  muted: "#737373",
  edge: "#d4d4d4",
  dot: "#d4d4d4",
}

// 中文字体：assets/fonts 下的 Noto Sans SC 子集（OFL），构建时读本地文件，不联网；说明见 assets/fonts/README.md
let fontPromise: Promise<ArrayBuffer> | undefined
function loadFont() {
  fontPromise ??= readFile(
    join(process.cwd(), "assets/fonts/NotoSansSC-og-subset.otf"),
  ).then((buf) => new Uint8Array(buf).buffer)
  return fontPromise
}

// 与 src/app/icon.svg 同一个标志，固定为深色
const logo = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 584 584"><path fill="#0a0a0a" transform="translate(84 0)" d="M156 130 416 0 416 36 156 166ZM156 192 416 62 416 98 156 228ZM156 254 416 124 416 160 156 290ZM0 394 416 186 416 258 0 466ZM78 453 416 284 416 356 78 525ZM156 512 416 382 416 454 156 584Z"/></svg>',
)}`

// 版面坐标：容器竖线 x=100 / x=1100，横线 y=96 / y=534（与站点的线条网格一致）
const LEFT = 100
const RIGHT = 1100
const TOP = 96
const BOTTOM = 534

function Cross({ x, y }: { x: number; y: number }) {
  const arm = 7
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - arm,
          top: y,
          width: arm * 2 + 1,
          height: 1,
          backgroundColor: color.fg,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x,
          top: y - arm,
          width: 1,
          height: arm * 2 + 1,
          backgroundColor: color.fg,
        }}
      />
    </>
  )
}

function titleSize(title: string) {
  const length = [...title].length
  if (length <= 8) return 92
  if (length <= 14) return 76
  if (length <= 22) return 60
  return 50
}

// Satori 不支持 line-clamp：按宽度估算（中文 1，其它 0.55）截断到约两行
function clamp(text: string, max = 62) {
  let width = 0
  let out = ""
  for (const char of text) {
    width += /[\u2e80-\u9fff\uff00-\uffef]/.test(char) ? 1 : 0.55
    if (width > max) return `${out.trimEnd()}…`
    out += char
  }
  return out
}

export type OgCardProps = {
  /** 右上角分区标签，如「COMPONENTS · 组件」 */
  kind: string
  title: string
  titleEn?: string
  description?: string
  /** 页脚显示的站内路径，如 /components/foo/ */
  path?: string
}

export async function ogImage({
  kind,
  title,
  titleEn,
  description,
  path = "/",
}: OgCardProps) {
  const font = await loadFont()
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: color.bg,
          // Satori 的 radial-gradient 只认 closest-side + 百分比色标，像素色标不会渲染
          backgroundImage: `radial-gradient(circle closest-side, ${color.dot} 0, ${color.dot} 16%, transparent 22%)`,
          backgroundSize: "16px 16px",
          color: color.fg,
          fontFamily: "Noto Sans SC",
        }}
      >
        {/* 内容区：覆盖点阵，左右竖线 */}
        <div
          style={{
            position: "absolute",
            left: LEFT,
            top: 0,
            width: RIGHT - LEFT + 1,
            height: "100%",
            backgroundColor: color.bg,
            borderLeft: `1px solid ${color.edge}`,
            borderRight: `1px solid ${color.edge}`,
          }}
        />
        {/* 贯穿全宽的横线，盖在点阵与内容区之上 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: TOP,
            width: "100%",
            height: 1,
            backgroundColor: color.edge,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: BOTTOM,
            width: "100%",
            height: 1,
            backgroundColor: color.edge,
          }}
        />
        <Cross x={LEFT} y={TOP} />
        <Cross x={RIGHT} y={TOP} />
        <Cross x={LEFT} y={BOTTOM} />
        <Cross x={RIGHT} y={BOTTOM} />

        {/* 页头：站点名 + 分区标签 */}
        <div
          style={{
            position: "absolute",
            left: LEFT + 48,
            top: 0,
            width: RIGHT - LEFT - 96,
            height: TOP,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} width={34} height={34} alt="" />
            <div
              style={{ marginLeft: 16, fontSize: 28, letterSpacing: "-0.01em" }}
            >
              yiui.dev
            </div>
          </div>
          <div
            style={{
              fontSize: 20,
              letterSpacing: "0.12em",
              color: color.muted,
            }}
          >
            {kind}
          </div>
        </div>

        {/* 主体：中文标题 + 英文副标题 + 描述 */}
        <div
          style={{
            position: "absolute",
            left: LEFT + 48,
            top: TOP + 1,
            width: RIGHT - LEFT - 96,
            height: BOTTOM - TOP - 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: titleSize(title),
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              // 只有 Regular 一个字重：用描边把标题加粗
              WebkitTextStroke: "1.5px #0a0a0a",
            }}
          >
            {title}
          </div>
          {titleEn ? (
            <div
              style={{
                marginTop: 16,
                fontSize: 36,
                color: color.muted,
                letterSpacing: "-0.01em",
              }}
            >
              {titleEn}
            </div>
          ) : null}
          {description ? (
            <div
              style={{
                marginTop: 32,
                fontSize: 26,
                lineHeight: 1.6,
                color: color.muted,
              }}
            >
              {clamp(description)}
            </div>
          ) : null}
        </div>

        {/* 页脚：站内路径 */}
        <div
          style={{
            position: "absolute",
            left: LEFT + 48,
            top: BOTTOM + 1,
            width: RIGHT - LEFT - 96,
            height: 630 - BOTTOM - 1,
            display: "flex",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: "0.04em",
            color: color.muted,
          }}
        >
          {`yiui.dev${path === "/" ? "" : path}`}
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [{ name: "Noto Sans SC", data: font, style: "normal", weight: 400 }],
    },
  )
}
