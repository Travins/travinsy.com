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
  rotateShapes,
  wallPath,
  type IsometricPoint,
  type IsometricShape,
  type IsometricView,
  type IsometricWall,
} from "./geometry"

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
   * 视角。`isometric`：图形平放在地面上、沿等轴测方向挤出；
   * `front`：把图形当作一块板，向后倒下 `tilt` 度、水平转 `turn` 度后正交投影，斜线与竖线的关系保持——适合要保留原样的标志
   * @default "isometric"
   */
  view?: IsometricView
  /**
   * `front` 视角下板向后倒下的角度（度）：0 是正面立着，越大越往后躺
   * @default 45
   */
  tilt?: number
  /**
   * `front` 视角下板水平转动的角度（度），负数向左转、露出右侧的厚度
   * @default -20
   */
  turn?: number
  /** 可访问名称；不传时整个图形对读屏隐藏 */
  label?: string
}

/** 单面侧墙：高度由弹簧驱动，墙路径随高度重算，顶边始终贴着顶面。 */
function IsometricMarkWall({
  wall,
  height,
  gradientId,
  extrude,
}: {
  wall: IsometricWall
  height: MotionValue<number>
  gradientId: string
  extrude: readonly [number, number]
}) {
  const d = useTransform(height, (h) => wallPath(wall, h, extrude))

  // 同一面先画底色线再画高光线，后画的近处面会盖住远处面的线
  return (
    <g data-slot="isometric-mark-wall">
      <motion.path d={d} className="fill-background" stroke="var(--stroke)" />
      <motion.path d={d} fill="none" stroke={`url(#${gradientId})`} />
    </g>
  )
}

/** 把平面多边形挤出成等轴测线条 3D，带斜纹顶面、跟随鼠标的高光与按下效果。 */
function IsometricMark({
  shapes,
  rotation = 0,
  depth: depthProp,
  pressedDepth,
  interactive = true,
  highlight = true,
  guides = false,
  view = "isometric",
  tilt = 45,
  turn = -20,
  label,
  className,
  ref,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onPointerLeave,
  ...props
}: IsometricMarkProps) {
  const id = React.useId()
  const patternId = `isometric-mark-pattern-${id}`
  const gradientId = `isometric-mark-light-${id}`

  const model = React.useMemo(
    () =>
      buildIsometricModel(
        rotateShapes(shapes, rotation),
        depthProp,
        guides === "edges" ? "edges" : "box",
        view,
        { tilt, turn },
      ),
    [shapes, rotation, depthProp, guides, view, tilt, turn],
  )
  const { viewBox, unit, depth } = model
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
  const [ex, ey] = model.extrude
  const topOffsetX = useTransform(height, (h) => -ex * (depth - h))
  const topOffset = useTransform(height, (h) => -ey * (depth - h))

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

  const release = () => setPressed(false)
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
        "block h-auto w-full touch-manipulation overflow-visible [--guide:color-mix(in_oklab,var(--foreground)_14%,transparent)] [--pattern:color-mix(in_oklab,var(--foreground)_12%,var(--background))] [--stroke:color-mix(in_oklab,var(--foreground)_16%,var(--background))]",
        className,
      )}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        if (interactive) setPressed(true)
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
          <path
            d={`M${-unit} ${unit}l${unit * 2} ${-unit * 2}M0 ${hatch}l${hatch} ${-hatch}M${hatch - unit} ${hatch + unit}l${unit * 2} ${-unit * 2}`}
            stroke="var(--pattern)"
            strokeWidth={unit}
          />
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
            extrude={model.extrude}
          />
        ))}

        <motion.g
          data-slot="isometric-mark-top"
          style={{ x: topOffsetX, y: topOffset }}
        >
          <path d={model.top} className="fill-background" />
          <path d={model.top} fill={`url(#${patternId})`} />
          <path d={model.top} stroke="var(--stroke)" />
          <path d={model.top} stroke={`url(#${gradientId})`} />
        </motion.g>
      </g>
    </svg>
  )
}

export { IsometricMark }
export type {
  IsometricMarkProps,
  IsometricPoint,
  IsometricShape,
  IsometricView,
}
