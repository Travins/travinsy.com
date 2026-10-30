import { codeThemes } from "./src/components/docs/highlight-theme"
import { defineConfig, defineDocs } from "fumadocs-mdx/config"
import { pageSchema } from "fumadocs-core/source/schema"
import { z } from "zod"

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema.extend({
      description: z.string(),
      /** 英文名（Title Case）：组件、区块、模板的中英文对照 */
      titleEn: z.string().optional(),
      /** 分组 id：登记在 src/components/docs/docs-groups.ts，决定侧栏与列表页的分组 */
      group: z.string().optional(),
      /** 状态标记：`new` 在侧栏条目旁显示一个小小的「新」，组件稳定后删掉这一行即可 */
      status: z.enum(["new"]).optional(),
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
