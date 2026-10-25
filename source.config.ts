import { codeThemes } from "./src/components/docs/highlight-theme"
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

export const blog = defineDocs({
  dir: "content/blog",
  docs: {
    schema: pageSchema.extend({
      title: z.string().min(1),
      description: z.string().min(1),
      date: z.iso.date(),
      tags: z.array(z.string()).optional(),
      draft: z.boolean().optional(),
    }),
  },
})

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: codeThemes,
      defaultColor: false,
    },
  },
})
