/**
 * 代码高亮用 shiki 内置的 GitHub 双主题，配合 defaultColor: false，
 * 每个 token 输出 --shiki-light / --shiki-dark 两个变量，由 docs.css 按 .dark 选择。
 */
export const codeThemes = {
  light: "github-light-default",
  dark: "github-dark-default",
} as const
