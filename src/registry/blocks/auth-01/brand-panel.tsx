import { cn } from "@/lib/utils"

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

/** 大屏左半边的品牌面板：主色渐变 + 模糊光斑 + 同心圆环。所有颜色都来自 primary。 */
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
      className="relative hidden overflow-hidden bg-linear-to-br from-primary/90 via-primary to-primary/80 text-primary-foreground lg:flex lg:w-1/2"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute top-20 left-10 size-72 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="absolute right-10 bottom-20 size-96 rounded-full bg-primary-foreground/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-foreground/10" />
        <div className="absolute top-1/2 left-1/2 size-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-foreground/10" />
      </div>
      <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
        <div className="mb-8 flex items-center gap-3">
          <Logo logo={brand.logo} className="size-14" />
          <span className="text-2xl font-bold" translate="no">
            {brand.name}
          </span>
        </div>
        <p className="mb-6 text-2xl leading-tight font-bold text-balance xl:text-3xl">
          {brand.title}
        </p>
        <p className="mb-10 max-w-md text-lg leading-8 text-primary-foreground/80">
          {brand.description}
        </p>
        <ul className="flex flex-col gap-4">
          {brand.features.map((feature) => (
            <li key={feature.title} className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="rounded-lg bg-primary-foreground/20 p-2 [&_svg]:size-5"
              >
                {feature.icon}
              </span>
              <div>
                <div className="font-medium">{feature.title}</div>
                <div className="text-sm text-primary-foreground/70">
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
