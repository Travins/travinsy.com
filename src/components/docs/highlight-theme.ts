import { createCssVariablesTheme } from "shiki"
export const codeTheme = createCssVariablesTheme({
  name: "site-tokens",
  variablePrefix: "--code-",
  variableDefaults: {
    foreground: "var(--foreground)",
    background: "var(--muted)",
    "token-constant": "var(--primary)",
    "token-string": "var(--primary)",
    "token-comment": "var(--muted-foreground)",
    "token-keyword": "var(--primary)",
    "token-parameter": "var(--foreground)",
    "token-function": "var(--foreground)",
    "token-string-expression": "var(--primary)",
    "token-punctuation": "var(--muted-foreground)",
    "token-link": "var(--primary)",
  },
})
