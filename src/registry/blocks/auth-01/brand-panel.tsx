import { cn } from "@/lib/utils"
import { GlyphField } from "@/registry/ui/glyph-field/glyph-field"
import { Ripple } from "@/registry/ui/ripple/ripple"
import { TextReveal } from "@/registry/ui/text-animate/text-animate"

import type { BrandConfig } from "./brand"
import { formatLabel, resolveLabels, type Auth01Labels } from "./config"

function Logo({
  logo,
  className,
}: {
  logo: BrandConfig["logo"]
  className: string
}) {
  // 外层限定尺寸，内部的 svg / img 自动缩放到框内
  return (
    <span
      data-slot="auth-01-brand-logo"
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center [&>*]:max-h-full [&>*]:max-w-full [&>svg]:size-full",
        className,
      )}
    >
      {logo}
    </span>
  )
}

/**
 * 大屏左半边的品牌面板：主色渐变 + 模糊光斑 + 向外扩散的波纹 + 四周的字符矩阵。
 * 亮色下是主色底配 primary-foreground 文字；暗色下 primary 会变成浅色，整块面板会变亮，
 * 所以暗色改为 card 深底，只用 primary 的低透明度渐变染上主题色，文字回到 foreground。
 * 光斑、波纹、字符矩阵、图标底共用 --panel-glow，随亮暗一起切换。
 */
function BrandPanel({
  brand,
  labels,
}: {
  brand: BrandConfig
  labels?: Partial<Auth01Labels>
}) {
  const text = resolveLabels(labels)
  return (
    <aside
      data-slot="auth-01-brand-panel"
      aria-label={formatLabel(text.brandPanelLabel, { name: brand.name })}
      className="relative hidden overflow-hidden bg-linear-to-br from-primary/90 via-primary to-primary/80 text-primary-foreground [--panel-glow:var(--primary-foreground)] lg:flex lg:w-1/2 dark:bg-card dark:from-primary/16 dark:via-primary/7 dark:to-primary/3 dark:text-foreground dark:[--panel-glow:var(--primary)]"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute top-20 left-10 size-72 rounded-full bg-(--panel-glow)/10 blur-3xl" />
        <div className="absolute right-10 bottom-20 size-96 rounded-full bg-(--panel-glow)/5 blur-3xl" />
        {/* 字符矩阵只铺在四周，中间留白给文字；GlyphField 自带底色，这里改成透明 */}
        <GlyphField
          fade="center"
          glyphs="01"
          tone="var(--panel-glow)"
          density={0.4}
          fontSize={13}
          speed={0.02}
          className="absolute inset-0 min-h-0 bg-transparent opacity-25"
        />
        <Ripple
          size={720}
          rings={4}
          ringGap={140}
          baseSize={200}
          duration={8}
          background="none"
          tone="var(--panel-glow)"
          className="absolute inset-0 h-full"
        />
      </div>
      <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
        <div className="mb-8 flex items-center gap-3">
          <Logo logo={brand.logo} className="size-14" />
          <span className="text-2xl font-bold" translate="no">
            {brand.name}
          </span>
        </div>
        <p className="mb-6 text-2xl leading-tight font-bold text-balance xl:text-3xl">
          <TextReveal by="word" trigger="mount" stagger={70}>
            {brand.title}
          </TextReveal>
        </p>
        <p className="mb-10 max-w-md text-lg leading-8 text-current/80">
          {brand.description}
        </p>
        <ul className="flex flex-col gap-4">
          {brand.features.map((feature) => (
            <li key={feature.title} className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="rounded-lg bg-(--panel-glow)/20 p-2 [&_svg]:size-5"
              >
                {feature.icon}
              </span>
              <div>
                <div className="font-medium">{feature.title}</div>
                <div className="text-sm text-current/70">
                  {feature.description}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

/** 窄屏下表单上方的 Logo + 名称（品牌面板此时被隐藏）。 */
function MobileBrand({ brand }: { brand: BrandConfig }) {
  return (
    <div
      data-slot="auth-01-mobile-brand"
      className="mb-8 flex items-center justify-center gap-2 lg:hidden"
    >
      <Logo logo={brand.logo} className="size-10" />
      <span className="text-xl font-bold" translate="no">
        {brand.name}
      </span>
    </div>
  )
}

export { BrandPanel, MobileBrand }
