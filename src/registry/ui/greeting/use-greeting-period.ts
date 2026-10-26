"use client"

import { useNow } from "@/registry/hooks/use-now"

import {
  normalizeBoundaries,
  resolvePeriod,
  type GreetingBoundaries,
  type GreetingPeriod,
} from "./period"

type GreetingState = {
  /** 当前时段；服务端与水合期间为 `null` */
  period: GreetingPeriod | null
  /** 当前时段已经过去的比例（0–1） */
  progress: number
}

/**
 * 访客本地时间所在的时段，每分钟校准一次。
 * 传入 `hour` 时直接用它（可带小数，如 `13.5`），此时结果是确定的，服务端也能渲染。
 */
function useGreetingPeriod(
  boundaries?: Partial<GreetingBoundaries>,
  hour?: number,
): GreetingState {
  const now = useNow(60_000)
  const normalized = normalizeBoundaries(boundaries)
  if (hour !== undefined)
    return resolvePeriod(((hour % 24) + 24) % 24, normalized)
  if (now === null) return { period: null, progress: 0 }
  const date = new Date(now)
  return resolvePeriod(date.getHours() + date.getMinutes() / 60, normalized)
}

export { useGreetingPeriod }
export type { GreetingState }
