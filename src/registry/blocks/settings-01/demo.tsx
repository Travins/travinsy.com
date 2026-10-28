import { Settings01 } from "./settings-01"

/**
 * 预览：出厂默认的强调色是「跟随主题色」，而默认的中性主题里主题色接近黑色，整页控件会发灰。
 * 预览改用蓝色作为默认值（通过 `defaults`，所以不算「已修改」），切到其他颜色主题时再选「主题色」即可看到跟随效果。
 */
const PREVIEW_DEFAULTS = { accent: "blue" } as const

export default function Settings01Demo() {
  return <Settings01 defaults={PREVIEW_DEFAULTS} />
}
