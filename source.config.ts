import { codeTheme } from "./src/components/docs/highlight-theme"
import { defineConfig, defineDocs } from "fumadocs-mdx/config"
import { pageSchema } from "fumadocs-core/source/schema"
import { z } from "zod"

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema.extend({
      description: z.string(),
      links: z.record(z.string(), z.url()).optional(),
    }),
  },
})

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: { light: codeTheme, dark: codeTheme },
      defaultColor: false,
    },
  },
})
