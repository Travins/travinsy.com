"use client"

import { useCallback, useState } from "react"

import { DEFAULT_LABELS } from "./config"
import { errorMessage } from "./utils"

type SaveStatus = "idle" | "pending" | "saved" | "error"

/** 包装保存动作：管理 loading，成功后记为 saved，抛出的错误转成可展示的文案。 */
function useSaveAction(fallbackError: string = DEFAULT_LABELS.saveFailed) {
  const [status, setStatus] = useState<SaveStatus>("idle")
  const [error, setError] = useState<string | null>(null)
  const run = useCallback(
    async (action: () => Promise<void>) => {
      setStatus("pending")
      setError(null)
      try {
        await action()
        setStatus("saved")
        return true
      } catch (caught) {
        setError(errorMessage(caught, fallbackError))
        setStatus("error")
        return false
      }
    },
    [fallbackError],
  )
  /** 回到空闲：设置被再次修改后，「已保存」「出错」的提示就该消失 */
  const reset = useCallback(() => {
    setStatus("idle")
    setError(null)
  }, [])
  return { status, error, run, reset }
}

export { useSaveAction }
export type { SaveStatus }
