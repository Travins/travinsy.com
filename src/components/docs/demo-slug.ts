/**
 * 示例全屏页的地址：/demo/<组件>-mobile/。示例名的 `-demo` 后缀换成 `-mobile`，
 * 如 `xy-pad-demo` → `xy-pad-mobile`、`amount-input-form-demo` → `amount-input-form-mobile`。
 * 「手机上的体验」示例本身叫 `<组件>-mobile-demo`，换完会和主示例撞名，改叫 `<组件>-phone-mobile`。
 */
function toDemoSlug(name: string) {
  const base = name.replace(/-demo$/, "")
  return base.endsWith("-mobile")
    ? `${base.slice(0, -"-mobile".length)}-phone-mobile`
    : `${base}-mobile`
}

function demoPath(name: string) {
  return `/demo/${toDemoSlug(name)}/`
}

export { demoPath, toDemoSlug }
