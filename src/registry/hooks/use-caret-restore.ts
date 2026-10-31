"use client"

import * as React from "react"

/** 格式化提交后恢复光标；即使文本未变，也用新请求触发恢复。 */
function useCaretRestore(inputRef: React.RefObject<HTMLInputElement | null>) {
  const [caret, setCaret] = React.useState<{ position: number } | null>(null)
  React.useLayoutEffect(() => {
    const input = inputRef.current
    if (caret && input && document.activeElement === input)
      input.setSelectionRange(caret.position, caret.position)
  }, [caret, inputRef])
  return setCaret
}

export { useCaretRestore }
