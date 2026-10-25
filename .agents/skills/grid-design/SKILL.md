---
name: grid-design
description: travinsy.com 的线条网格设计规范。在本项目里做任何页面、区块、模板布局时使用：竖线容器、全屏横线、刻度尺分隔带与交点十字、虚线分栏、章节编号栏、配色与排版规则。
---

# 线条网格设计规范

## 结构模型

整页只有**一个** `GridContainer`（固定宽度 + 左右竖线），所有内容按"行"自上而下堆叠：

```tsx
import {
  GridColumns,
  GridContainer,
  GridSection,
  GridSeparator,
} from "@/registry/ui/grid-layout/grid-layout"

<GridContainer>
  <GridSection className="px-4 py-6">…</GridSection>   {/* 底部全屏横线 */}
  <GridSeparator />                                     {/* 刻度尺分隔带 + 交点十字 */}
  <GridSection>
    <GridColumns>                                       {/* 虚线分栏 */}
      <div className="p-4">…</div>
      <div className="p-4">…</div>
    </GridColumns>
  </GridSection>
</GridContainer>
```

底层工具类（`src/styles/grid.css`）：
- `screen-line-top` / `screen-line-bottom`：横跨整个屏幕的 1px 线（分别占用 `::before` / `::after`，不要在同一元素上再用这两个伪元素）
- 纹路：`bg-ruler`（刻度尺）、`bg-hatch`（斜纹）、`bg-dots`（点阵）、`bg-grid-fine`（细网格）、`bg-plus`（十字阵列）、`bg-wave`（波形）；横向起点由 `--pattern-x` 控制
- 颜色 token：`border-edge` / `bg-edge` / `divide-edge`（`--edge` 由前景色混合得到，自动适配所有颜色主题）

## 规则

1. **只画底线**：相邻两行只由上一行的 `screen-line-bottom` 分隔，不要上下都画，否则会出现 2px 线。页面第一行（紧接 Header）由 Header 自带底线。
2. 行与行之间要换主题时（如个人信息 → 作品），用 `GridSeparator`；同一主题内部用普通 `GridSection`。
   - **默认是 `ruler`（刻度尺）+ 四个交点十字**，页面里的主分隔一律用它，不要每处换一种纹路。
   - 其余纹路是变体：`hatch`（斜纹）、`dots`、`grid`、`plus`、`wave`、`none`（只留线条），用于局部强调或区分特殊区域（如文档预览、某一块实验性内容），一页里最多再出现一种。
   - `label="02 / PROJECTS"` 给分隔带加等宽编号，后接虚线，可与任意纹路组合；用于大段落切换，不要每条都加。
   - `crosshair` 默认只在 `ruler` 上开启；`GridSection` 也可传 `crosshair` 在底线两端绘制。十字也可用 `GridCrosshair` 单独放在带 `relative` 的卡片四角。
3. 行内边距统一 `px-4`（≥sm 时 `sm:px-6` 可选），不要让内容贴到竖线上。
4. 容器外的左右空白（gutter）尽量保持干净；确需放装饰元素时，必须 `hidden lg:block`、`aria-hidden`、`pointer-events-none`，用绝对定位相对于 `GridSection` 向外偏移。不要把手写体 follow me 之类的装饰当作默认。
5. 页面宽度：作品集类页面容器用 64rem（`--grid-width`），正文类内容（文章）自己限制到约 42rem 并居中；章节可以用「左侧窄编号栏 + 右侧内容」的两栏结构（宽屏 `md:grid-cols-[9rem_1fr]`，窄屏编号移到标题上方），编号栏用竖线与内容隔开。
6. 线条一律用 `edge` 颜色，不要用 `border-border`（太重）或任何硬编码颜色。
7. 等宽字体（`font-mono`）用于元信息：时间、邮箱、电话、坐标、标签；正文和标题用 `font-sans`。
8. 图标容器：`size-8 rounded-md border border-edge bg-muted/50` 之类的小方块。
9. 克制配色：默认黑白灰，强调色只来自 `primary`；颜色主题切换后整站应自然变化。
10. 动效用 `motion`，时长 150–300ms，尊重 `prefers-reduced-motion`。
11. 中文排版：正文 `leading-7`，标题 `tracking-tight`；中英文之间留空格。

## 自查清单
- [ ] 改变颜色主题、切换亮暗模式后线条都可见且不刺眼
- [ ] 375px 宽度下无横向滚动条，分栏正确堆叠
- [ ] 没有出现双线、断线；交点十字落在竖线与横线的正中
- [ ] 页面主分隔用默认 ruler，其他纹路只在局部使用
