import * as React from "react"

/** 触摸时移动超过这么多像素才判断方向 */
const TOUCH_SLOP = 6

/**
 * 触摸手势分流：手指按在整条滑块上时先不交给 Base UI，看清意图再说。
 * - 先往上下走：是在滚动页面。滑块是 `touch-action: pan-y`，浏览器接管滚动，值不动
 * - 先往左右走：是在拖动。在当前位置补发一个 pointerdown 给 Control，之后的移动照常由 Base UI 处理
 * - 没怎么动就松手：是点按。在松手处补发按下 + 松开，等同于点轨道跳到该处
 *
 * Base UI 的滑块会在页面滚动时继续跟着手指改值（它在 pointercancel 之后还监听 touchmove），
 * 整条方条又占满宽度，不分流的话手机上划过一排滑块就会把值全改掉。鼠标和笔不受影响。
 */
function useTouchIntent(
  controlRef: React.RefObject<HTMLElement | null>,
  disabled: boolean | undefined,
) {
  React.useEffect(() => {
    const control = controlRef.current
    // 拦截要发生在 Control 之上：Base UI 的 touchstart 直接挂在 Control 上，React 的事件挂在根节点上
    const gate = control?.parentElement
    if (!control || !gate || disabled) return

    let pending: {
      id: number
      x: number
      y: number
      target: EventTarget
    } | null = null

    const replay = (
      type: "pointerdown" | "pointerup",
      target: EventTarget,
      from: PointerEvent,
      pointerId: number,
    ) =>
      target.dispatchEvent(
        new PointerEvent(type, {
          bubbles: true,
          cancelable: true,
          composed: true,
          clientX: from.clientX,
          clientY: from.clientY,
          screenX: from.screenX,
          screenY: from.screenY,
          pointerId,
          pointerType: "touch",
          isPrimary: true,
          button: 0,
          buttons: type === "pointerdown" ? 1 : 0,
        }),
      )

    const onPointerDown = (event: PointerEvent) => {
      if (
        event.pointerType !== "touch" ||
        !event.isTrusted ||
        !control.contains(event.target as Node)
      )
        return
      event.stopPropagation()
      pending = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        target: event.target as EventTarget,
      }
    }
    // Base UI 收到 touchstart 会自己开始一次按下；交给上面的分流统一处理
    const onTouchStart = (event: TouchEvent) => {
      if (control.contains(event.target as Node)) event.stopPropagation()
    }
    const onPointerMove = (event: PointerEvent) => {
      if (!pending || event.pointerId !== pending.id || !event.isTrusted) return
      const dx = Math.abs(event.clientX - pending.x)
      const dy = Math.abs(event.clientY - pending.y)
      if (dx < TOUCH_SLOP && dy < TOUCH_SLOP) return
      const { target } = pending
      pending = null
      // 先往上下走：浏览器会接着滚动页面并发出 pointercancel，这里放手即可
      if (dy >= dx) return
      // 用真实的 pointerId：Base UI 会捕获这根手指，过冲动画也按 id 跟踪后续移动
      replay("pointerdown", target, event, event.pointerId)
    }
    const onPointerUp = (event: PointerEvent) => {
      if (!pending || event.pointerId !== pending.id || !event.isTrusted) return
      const { target } = pending
      pending = null
      // 手指已经抬起，不能再捕获它：pointerId 传 0，Base UI 遇到 0 会跳过 setPointerCapture
      replay("pointerdown", target, event, 0)
      replay("pointerup", target, event, 0)
    }
    const onPointerCancel = (event: PointerEvent) => {
      if (pending && event.pointerId === pending.id) pending = null
    }

    gate.addEventListener("pointerdown", onPointerDown, { capture: true })
    gate.addEventListener("touchstart", onTouchStart, {
      capture: true,
      passive: true,
    })
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    window.addEventListener("pointerup", onPointerUp)
    window.addEventListener("pointercancel", onPointerCancel)
    return () => {
      gate.removeEventListener("pointerdown", onPointerDown, { capture: true })
      gate.removeEventListener("touchstart", onTouchStart, { capture: true })
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      window.removeEventListener("pointercancel", onPointerCancel)
    }
  }, [controlRef, disabled])
}

export { useTouchIntent }
