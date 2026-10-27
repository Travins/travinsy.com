"use client"

import * as React from "react"

/**
 * 按下 / 松开的音效：用 Web Audio 现场合成，不需要音频文件。
 * 按下是一声清脆的「咔」（短促的下滑正弦 + 高频带通噪声做触感，只留少量低频厚度），松开是更轻、更高的一声「嗒」。
 * AudioContext 在第一次按下（用户手势）时才创建，满足浏览器的自动播放限制。
 */
let context: AudioContext | null = null

function audio() {
  if (typeof window === "undefined") return null
  if (!context) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!Ctor) return null
    context = new Ctor()
  }
  if (context.state === "suspended") void context.resume()
  return context
}

function tone(from: number, to: number, duration: number, volume: number) {
  const ctx = audio()
  if (!ctx) return
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = "sine"
  osc.frequency.setValueAtTime(from, now)
  osc.frequency.exponentialRampToValueAtTime(to, now + duration)
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.004)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
  osc.connect(gain).connect(ctx.destination)
  osc.start(now)
  osc.stop(now + duration + 0.02)
}

function tick(frequency: number, duration: number, volume: number) {
  const ctx = audio()
  if (!ctx) return
  const now = ctx.currentTime
  const length = Math.ceil(ctx.sampleRate * duration)
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++)
    data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3
  const source = ctx.createBufferSource()
  source.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = "bandpass"
  filter.frequency.value = frequency
  filter.Q.value = 1.2
  const gain = ctx.createGain()
  gain.gain.value = volume
  source.connect(filter).connect(gain).connect(ctx.destination)
  source.start(now)
}

function playPress() {
  // 低频收短、减轻，只留一点厚度；主体交给更高、更短的「咔」
  tone(320, 140, 0.07, 0.14)
  tone(1400, 900, 0.03, 0.07)
  tick(3600, 0.015, 0.2)
}

function playRelease() {
  tone(620, 480, 0.04, 0.06)
  tick(5200, 0.01, 0.12)
}

/* ---------- 静音偏好：存在 localStorage，同页所有标志共用 ---------- */

const STORAGE_KEY = "isometric-mark:muted"
const listeners = new Set<() => void>()

function readMuted() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1"
  } catch {
    return false
  }
}

function setMuted(muted: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, muted ? "1" : "0")
  } catch {
    // 隐私模式等存不了时只在本页生效
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

/** 读取 / 切换音效静音。服务端与水合阶段按未静音渲染，挂载后再读本地偏好。 */
function useIsometricMarkMuted() {
  const muted = React.useSyncExternalStore(subscribe, readMuted, () => false)
  return [muted, setMuted] as const
}

export { playPress, playRelease, useIsometricMarkMuted }
