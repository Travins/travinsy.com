"use client"

import * as React from "react"
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"

import { cn } from "@/lib/utils"

import {
  buildIsometricModel,
  ISOMETRIC_ELEVATION,
  rotateShapes,
  wallPath,
  type IsometricModel,
  type IsometricPoint,
  type IsometricShape,
  type IsometricWall,
} from "./geometry"
import { playPress, playRelease, useIsometricMarkMuted } from "./sound"

/** 按下 / 弹起共用的弹簧，手感接近真实按键。 */
const PRESS_SPRING = { stiffness: 200, damping: 18, mass: 0.5 }
/** 高光跟随鼠标的弹簧，比按下更“跟手”。 */
const LIGHT_SPRING = { stiffness: 300, damping: 30, mass: 0.1 }

type IsometricMarkProps = Omit<React.ComponentProps<"svg">, "children"> & {
  /**
   * 平面形状，坐标是平面 logo 自己的坐标（y 向下）。
   * 请在组件外定义为常量，每次渲染传入新数组会重新计算几何。
   */
  shapes: readonly IsometricShape[]
  /**
   * 投影前绕图形中心旋转的角度（度），用来选择图形平躺在地上的朝向。
   * 取 90 的整数倍时图形的横竖边始终沿等轴测斜轴，看起来是一块平放的板；
   * 传 -90 时原图的横向沿右上方延伸、竖向沿右下方延伸，最接近“正着读”。
   * @default 0
   */
  rotation?: number
  /** 挤出高度，默认取图形平面尺寸的 12% */
  depth?: number
  /** 按下后的挤出高度，默认是 `depth` 的一半 */
  pressedDepth?: number
  /**
   * 点击 / 触摸时是否有按下效果
   * @default true
   */
  interactive?: boolean
  /**
   * 线条是否有跟随鼠标的高光；触屏与“减少动态效果”下自动关闭
   * @default true
   */
  highlight?: boolean
  /**
   * 背景里的虚线辅助线。`true` 或 `"box"`：包围盒四边沿等轴测轴延长；
   * `"edges"`：沿图形自己最长的两个边方向画外侧切线（适合斜向的图形，辅助线贴着长边与齐平的端点）
   * @default false
   */
  guides?: boolean | "box" | "edges"
  /**
   * 顶面材质：`hatch` 斜纹「/」、`hatch-reverse` 斜纹「\」、`cross` 交叉网纹、`dots` 点阵、`lines` 横纹、`plain` 素面。
   * 斜纹与图形的长边接近平行时会产生视差感，换成另一个方向或点阵即可
   * @default "hatch"
   */
  material?: IsometricMaterial
  /**
   * 在图形下方画一块与辅助线同方向、同平面的地面网格，向四周渐隐
   * @default false
   */
  floor?: boolean
  /**
   * 按下与松开时播放合成音效（Web Audio，无需音频文件）；尊重全站静音偏好，见 useIsometricMarkMuted
   * @default false
   */
  sound?: boolean
  /**
   * 视线的俯仰角（度，5–85）。默认约 35.26° 即标准等轴测；
   * 调大更接近俯视（地面更方、厚度更薄），调小更接近平视（地面更扁、厚度更高）
   */
  elevation?: number
  /** 可访问名称；不传时整个图形对读屏隐藏 */
  label?: string
}

/** 单面侧墙：高度由弹簧驱动，墙路径随高度重算，顶边始终贴着顶面。 */
function IsometricMarkWall({
  wall,
  height,
  gradientId,
  heightScale,
}: {
  wall: IsometricWall
  height: MotionValue<number>
  gradientId: string
  heightScale: number
}) {
  const d = useTransform(height, (h) => wallPath(wall, h, heightScale))

  // 同一面先画底色线再画高光线，后画的近处面会盖住远处面的线；有色调时墙面极淡着色、线条取同色
  return (
    <g
      data-slot="isometric-mark-wall"
      style={
        wall.tone
          ? ({
              "--wall-fill": `color-mix(in oklab, ${wall.tone} var(--tone-wall), var(--wall))`,
              "--wall-stroke": `color-mix(in oklab, ${wall.tone} var(--tone-line), var(--background))`,
            } as React.CSSProperties)
          : undefined
      }
    >
      <motion.path
        d={d}
        fill="var(--wall-fill, var(--wall))"
        stroke="var(--wall-stroke, var(--stroke))"
      />
      <motion.path d={d} fill="none" stroke={`url(#${gradientId})`} />
    </g>
  )
}

type IsometricMarkTuning = Partial<
  Pick<
    IsometricMarkProps,
    | "rotation"
    | "depth"
    | "elevation"
    | "guides"
    | "material"
    | "interactive"
    | "highlight"
    | "sound"
  >
> & {
  /** 固定画框：沿用原属性下的 viewBox，调整时容器大小与图形比例都不变 */
  stableFrame?: boolean
  /** 回报示例自己的实际取值（未被覆盖前，含自动高度与默认俯仰），面板据此显示当前值 */
  onReport?: (values: IsometricMarkReport) => void
}

type IsometricMarkReport = {
  rotation: number
  elevation: number
  depth: number
  guides: "box" | "edges" | false
  material: IsometricMaterial
  interactive: boolean
  highlight: boolean
  sound: boolean
}

/**
 * 可选的调整上下文：子树里所有 IsometricMark 的对应属性被这里的值覆盖。
 * 用于调试面板一类的场景；不包这一层时组件行为不变。
 */
const IsometricMarkTuningContext = React.createContext<IsometricMarkTuning>({})

type IsometricMaterial =
  "hatch" | "hatch-reverse" | "cross" | "dots" | "lines" | "plain"

/** 各材质在一个 size×size 平铺单元里的路径（u 为一个像素对应的长度） */
function materialPath(material: IsometricMaterial, size: number, u: number) {
  const slash = `M${-u} ${u}l${u * 2} ${-u * 2}M0 ${size}l${size} ${-size}M${size - u} ${size + u}l${u * 2} ${-u * 2}`
  const back = `M${-u} ${size - u}l${u * 2} ${u * 2}M0 0l${size} ${size}M${size - u} ${-u}l${u * 2} ${u * 2}`
  switch (material) {
    case "hatch":
      return slash
    case "hatch-reverse":
      return back
    case "cross":
      return slash + back
    case "lines":
      return `M0 ${size / 2}H${size}`
    default:
      return ""
  }
}

/** 把平面多边形挤出成等轴测线条 3D，带斜纹顶面、跟随鼠标的高光与按下效果。 */
function IsometricMark(allProps: IsometricMarkProps) {
  const tuning = React.useContext(IsometricMarkTuningContext)
  const { stableFrame, onReport, ...overrides } = tuning
  // 固定画框：沿用按原属性算出的 viewBox，调整时画框与图形比例都不变，
  // 容器既不长高也不把图形挤小；转到画框外的部分照常显示（svg overflow: visible）
  const {
    shapes,
    rotation = 0,
    depth,
    guides = false,
    elevation,
    material = "hatch",
    interactive = true,
    highlight = true,
    sound = false,
  } = allProps
  const baseModel = React.useMemo(
    () =>
      stableFrame || onReport
        ? buildIsometricModel(
            rotateShapes(shapes, rotation),
            depth,
            guides === "edges" ? "edges" : "box",
            elevation,
          )
        : undefined,
    [stableFrame, onReport, shapes, rotation, depth, guides, elevation],
  )
  const fixedViewBox = stableFrame ? baseModel?.viewBox : undefined
  React.useEffect(() => {
    if (!onReport || !baseModel) return
    onReport({
      rotation,
      elevation: elevation ?? ISOMETRIC_ELEVATION,
      depth: baseModel.depth,
      guides: guides === true ? "box" : guides,
      material,
      interactive,
      highlight,
      sound,
    })
  }, [
    onReport,
    baseModel,
    rotation,
    elevation,
    guides,
    material,
    interactive,
    highlight,
    sound,
  ])
  return (
    <IsometricMarkView
      {...allProps}
      {...overrides}
      fixedViewBox={fixedViewBox}
    />
  )
}

function IsometricMarkView({
  shapes,
  rotation = 0,
  depth: depthProp,
  pressedDepth,
  interactive = true,
  highlight = true,
  guides = false,
  material = "hatch",
  elevation,
  floor = false,
  sound = false,
  label,
  className,
  ref,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onPointerLeave,
  fixedViewBox,
  ...props
}: IsometricMarkProps & { fixedViewBox?: IsometricModel["viewBox"] }) {
  const id = React.useId()
  const patternId = `isometric-mark-pattern-${id}`
  const gradientId = `isometric-mark-light-${id}`

  const model = React.useMemo(
    () =>
      buildIsometricModel(
        rotateShapes(shapes, rotation),
        depthProp,
        guides === "edges" ? "edges" : "box",
        elevation,
      ),
    [shapes, rotation, depthProp, guides, elevation],
  )
  const { unit, depth } = model
  const viewBox = fixedViewBox ?? model.viewBox
  const pressedHeight = pressedDepth ?? depth / 2

  const rootRef = React.useRef<SVGSVGElement | null>(null)
  const setRef = React.useCallback(
    (node: SVGSVGElement | null) => {
      rootRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref],
  )

  const reduceMotion = useReducedMotion()
  const inView = useInView(rootRef, { margin: "80px" })

  // 当前挤出高度；顶面整体下移 depth - height，侧墙按 height 重算
  const [pressed, setPressed] = React.useState(false)
  const height = useSpring(depth, PRESS_SPRING)
  React.useEffect(() => {
    const target = pressed ? pressedHeight : depth
    if (reduceMotion) height.jump(target)
    else height.set(target)
  }, [pressed, pressedHeight, depth, reduceMotion, height])
  // 用 y 偏移而不是 transform 字符串，斜纹才会跟着轮廓一起走
  const topOffset = useTransform(height, (h) => (depth - h) * model.heightScale)

  // 高光：鼠标在窗口中的相对位置映射到 viewBox
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const lightX = useSpring(
    useTransform(mouseX, [0, 1], [viewBox.x, viewBox.x + viewBox.width]),
    LIGHT_SPRING,
  )
  const lightY = useSpring(
    useTransform(mouseY, [0, 1], [viewBox.y, viewBox.y + viewBox.height]),
    LIGHT_SPRING,
  )
  React.useEffect(() => {
    if (!highlight || reduceMotion || !inView) return
    if (window.matchMedia("(hover: none)").matches) return

    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX / window.innerWidth)
      mouseY.set(event.clientY / window.innerHeight)
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [highlight, reduceMotion, inView, mouseX, mouseY])

  const [muted] = useIsometricMarkMuted()
  const audible = sound && !muted
  const pressedRef = React.useRef(false)
  const release = () => {
    if (pressedRef.current && audible) playRelease()
    pressedRef.current = false
    setPressed(false)
  }
  const hatch = unit * 10

  return (
    <svg
      ref={setRef}
      data-slot="isometric-mark"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
      fill="none"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        "block h-auto w-full touch-manipulation overflow-visible select-none",
        // 颜色变量：顶面、侧墙、纹理、线条、着色比例。暗色下背景接近黑色，按同样比例混色几乎看不见，
        // 所以单独提亮：顶面比背景亮一档、侧墙再暗一点形成体积，纹理与线条加重，着色比例加大
        "[--guide:color-mix(in_oklab,var(--foreground)_14%,transparent)] [--pattern:color-mix(in_oklab,var(--foreground)_12%,var(--background))] [--stroke:color-mix(in_oklab,var(--foreground)_16%,var(--background))] [--tone-line:60%] [--tone-top:16%] [--tone-wall:9%] [--top:var(--background)] [--wall:var(--background)]",
        "dark:[--guide:color-mix(in_oklab,var(--foreground)_22%,transparent)] dark:[--pattern:color-mix(in_oklab,var(--foreground)_24%,var(--background))] dark:[--stroke:color-mix(in_oklab,var(--foreground)_38%,var(--background))] dark:[--tone-line:80%] dark:[--tone-top:30%] dark:[--tone-wall:18%] dark:[--top:color-mix(in_oklab,var(--foreground)_9%,var(--background))] dark:[--wall:color-mix(in_oklab,var(--foreground)_4%,var(--background))]",
        className,
      )}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        if (!interactive) return
        // 按住压下时别把旁边的文字一起选中（拖动或双击会从这里开始选区）
        if (event.pointerType === "mouse") event.preventDefault()
        if (audible) playPress()
        pressedRef.current = true
        setPressed(true)
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event)
        release()
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event)
        release()
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)
        release()
      }}
      {...props}
    >
      <defs>
        <pattern
          id={patternId}
          width={hatch}
          height={hatch}
          patternUnits="userSpaceOnUse"
        >
          {material === "dots" ? (
            <circle
              cx={hatch / 2}
              cy={hatch / 2}
              r={unit * 1.1}
              fill="var(--pattern)"
            />
          ) : (
            <path
              d={materialPath(material, hatch, unit)}
              stroke="var(--pattern)"
              strokeWidth={unit}
            />
          )}
        </pattern>

        <motion.radialGradient
          id={gradientId}
          cx={lightX}
          cy={lightY}
          r={unit * 200}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--foreground)" stopOpacity="0.7" />
          <stop offset="1" stopColor="var(--foreground)" stopOpacity="0" />
        </motion.radialGradient>
      </defs>

      {floor ? (
        <>
          {/* 地面网格直接用径向渐变描边：中心清晰、向外淡出，不影响图形本身 */}
          <radialGradient
            id={`${patternId}-floor`}
            cx={viewBox.x + viewBox.width / 2}
            cy={viewBox.y + viewBox.height / 2}
            r={Math.max(viewBox.width, viewBox.height) * 0.7}
            gradientUnits="userSpaceOnUse"
          >
            <stop
              offset="0"
              style={{ stopColor: "var(--foreground)", stopOpacity: 0.1 }}
            />
            <stop
              offset="0.55"
              style={{ stopColor: "var(--foreground)", stopOpacity: 0.07 }}
            />
            <stop
              offset="1"
              style={{ stopColor: "var(--foreground)", stopOpacity: 0 }}
            />
          </radialGradient>
          <path
            data-slot="isometric-mark-floor"
            d={model.floor}
            stroke={`url(#${patternId}-floor)`}
            strokeWidth={unit}
          />
        </>
      ) : null}

      {guides ? (
        <path
          data-slot="isometric-mark-guides"
          d={model.guides}
          stroke="var(--guide)"
          strokeWidth={unit}
          strokeDasharray={`${unit * 4} ${unit * 2}`}
        />
      ) : null}

      <g
        strokeWidth={unit}
        strokeLinejoin="round"
        strokeLinecap="round"
        fillRule="evenodd"
      >
        {model.walls.map((wall, index) => (
          <IsometricMarkWall
            key={index}
            wall={wall}
            height={height}
            gradientId={gradientId}
            heightScale={model.heightScale}
          />
        ))}

        <motion.g data-slot="isometric-mark-top" style={{ y: topOffset }}>
          {model.tops.some((top) => top.tone) ? (
            // 有色调的形状逐块画：淡色底 + 同一张材质纹理 + 同色描边
            model.tops.map((top, index) => (
              <g key={index}>
                <path
                  d={top.d}
                  fill={
                    top.tone
                      ? `color-mix(in oklab, ${top.tone} var(--tone-top), var(--top))`
                      : "var(--top)"
                  }
                />
                <path d={top.d} fill={`url(#${patternId})`} />
                <path
                  d={top.d}
                  stroke={
                    top.tone
                      ? `color-mix(in oklab, ${top.tone} var(--tone-line), var(--background))`
                      : "var(--stroke)"
                  }
                />
              </g>
            ))
          ) : (
            <>
              <path d={model.top} fill="var(--top)" />
              <path d={model.top} fill={`url(#${patternId})`} />
              <path d={model.top} stroke="var(--stroke)" />
            </>
          )}
          <path d={model.top} stroke={`url(#${gradientId})`} />
        </motion.g>
      </g>
    </svg>
  )
}

export { IsometricMark, IsometricMarkTuningContext, useIsometricMarkMuted }
export type {
  IsometricMarkProps,
  IsometricMarkReport,
  IsometricMarkTuning,
  IsometricMaterial,
  IsometricPoint,
  IsometricShape,
}
