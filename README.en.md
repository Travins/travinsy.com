<div align="center">

<a href="https://yiui.dev">
  <img src="src/app/icon.svg" alt="Yi UI" width="56" height="56" />
</a>

<h1>Yi UI</h1>

<p><strong>易</strong> · A line-grid styled React component library. Components install as source into your project, so the code is yours from day one.</p>

<p>
  <a href="https://yiui.dev">Website</a> ·
  <a href="https://yiui.dev/components/">Components</a> ·
  <a href="https://yiui.dev/blocks/">Blocks</a> ·
  <a href="https://yiui.dev/templates/">Templates</a> ·
  <a href="https://yiui.dev/themes/">Themes</a> ·
  <a href="https://yiui.dev/docs/installation/">Docs</a>
</p>

<p><a href="./README.md">简体中文</a> · <strong>English</strong></p>

</div>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/preview-dark.png" />
  <img src=".github/assets/preview-light.png" alt="yiui.dev home page: isometric mark with a tuning panel" />
</picture>

## About

Yi UI is a component library distributed as a **shadcn registry**, hosted on the author's personal site [yiui.dev](https://yiui.dev). Nothing ships as an npm package: the shadcn CLI copies the source into your project, where you can change styles, structure and behavior freely.

The name comes from the site's logo, the Chinese character 易 (*yì*), drawn as three thin and three thick slashes. It means both "easy" and "change": easy to pick up, and yours to change.

Everything follows one visual language, the line grid: full-width rules, ruled containers and dotted separators, combined with hairline borders, small radii and restrained motion.

The documentation is written in Simplified Chinese; an English version is planned.

## Features

- **You own the code** — Install with the shadcn CLI; the component, the registry items it depends on and the CSS variables it needs are written into your project together.
- **Built on Base UI** — Interactive primitives use [Base UI](https://base-ui.com), so keyboard support, focus management and screen-reader semantics come built in.
- **Theme-aware** — Every color comes from theme variables: light / dark plus 14 color themes, and components recolor as you switch.
- **A family of bar controls** — Value slider, segmented control, switch, tone picker, angle dial and XY pad share one height scale and look. Combine them into a parameter panel and copy the current values as JSX in one click.
- **Thoughtful motion** — Animations start when scrolled into view, pause off-screen and respect "reduce motion".
- **Static-first** — The site is a pure static export. Components that measure layout or draw on a canvas render a same-size placeholder before scripts load, so there are no blank areas or layout shifts.
- **AI-friendly** — Every doc page has a Markdown version, plus [`llms.txt`](https://yiui.dev/llms.txt) and [`llms-full.txt`](https://yiui.dev/llms-full.txt).

## Quick start

You need React 19, Tailwind CSS v4 and a shadcn project initialized with the **Base UI** base.

```bash
# New project (for an existing one, drop -t and -n)
pnpm dlx shadcn@latest init -t next -b base -p nova -n my-app

# Install any component by URL
pnpm dlx shadcn@latest add https://yiui.dev/r/value-slider.json
```

For shorter commands, register the namespace in `components.json`:

```json
{
  "registries": {
    "@travinsy": "https://yiui.dev/r/{name}.json"
  }
}
```

```bash
pnpm dlx shadcn@latest add @travinsy/value-slider
```

See the [installation guide](https://yiui.dev/docs/installation/) for where files land, how dependencies and styles are written, and common issues.

## Components

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/components-dark.png" />
  <img src=".github/assets/components-light.png" alt="Component gallery" />
</picture>

| Group | Components |
| --- | --- |
| Graphics & Motion | [Isometric Mark](https://yiui.dev/components/isometric-mark/) · [Flow Diagram](https://yiui.dev/components/flow-diagram/) · [Dotted Globe](https://yiui.dev/components/globe/) · [Glyph Field](https://yiui.dev/components/glyph-field/) · [Shuffle Grid](https://yiui.dev/components/shuffle-grid/) · [Orbit](https://yiui.dev/components/orbit/) · [Ripple](https://yiui.dev/components/ripple/) · [Code Stack](https://yiui.dev/components/code-stack/) |
| Form & Input | [Value Slider](https://yiui.dev/components/value-slider/) · [Control Panel](https://yiui.dev/components/control-panel/) · [XY Pad](https://yiui.dev/components/xy-pad/) · [Angle Dial](https://yiui.dev/components/angle-dial/) · [Segmented Control](https://yiui.dev/components/segmented-control/) · [Toggle Switch](https://yiui.dev/components/toggle-switch/) · [Tone Picker](https://yiui.dev/components/tone-picker/) |
| Data Display | [Chart Card](https://yiui.dev/components/chart-card/) · [Stat Card](https://yiui.dev/components/stat-card/) · [Mini Chart](https://yiui.dev/components/mini-chart/) |
| Text & Marquee | [Text Animate](https://yiui.dev/components/text-animate/) · [Marquee](https://yiui.dev/components/marquee/) |
| Content Display | [Timeline](https://yiui.dev/components/timeline/) · [Card Stack](https://yiui.dev/components/card-stack/) · [Checklist](https://yiui.dev/components/checklist/) |
| Time | [Local Time](https://yiui.dev/components/local-time/) · [Greeting](https://yiui.dev/components/greeting/) |
| Layout | [Grid Layout](https://yiui.dev/components/grid-layout/) |

## Blocks & templates

| Name | Description |
| --- | --- |
| [Settings `settings-01`](https://yiui.dev/blocks/settings-01/) | A full settings page built from the bar controls: section nav, live preview, modified count, reset and async save. |
| [Split sign-in `auth-01`](https://yiui.dev/blocks/auth-01/) | Brand panel plus forms: password / one-time-code sign-in, sign-up with a strength meter, password recovery. |
| [AI assistant `agent-chat-01`](https://yiui.dev/blocks/agent-chat-01/) | Embedded and floating layouts showing reasoning summaries, tool calls, sources and charts, with a built-in streaming demo. |
| [Console shell `app-shell-01`](https://yiui.dev/templates/app-shell-01/) | Fixed header, collapsible nav, workspace sidebar and AI assistant, with example pages full of stat cards and charts. |

## Color themes

Three neutral bases (Neutral, Stone, Slate) and 11 color themes (Red, Orange, Amber, Lime, Green, Teal, Sky, Blue, Violet, Fuchsia, Pink). Color themes always use white text on the primary color, at a contrast ratio of at least 4.5:1. Preview them on the [themes page](https://yiui.dev/themes/) and copy the CSS variables, or install one directly:

```bash
pnpm dlx shadcn@latest add https://yiui.dev/r/theme-blue.json
```

## Local development

```bash
git clone https://github.com/Travins/yi-ui.git
cd yi-ui
nvm use          # Node 24 (see .nvmrc)
pnpm install
pnpm dev
```

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Static build into `out/` |
| `pnpm lint` | Lint |
| `pnpm registry:build` | Generate `public/r/*.json` and other registry output |
| `pnpm registry:lint` | Check registry items for dependencies, files and conventions |
| `pnpm qa:shots <name>` | Screenshot QA on the build (light / dark, color themes, narrow widths, errors, overflow) |
| `pnpm qa:loading` | Block scripts and check pre-hydration placeholders and blank areas |

## Project structure

```
content/            Docs and blog (MDX)
src/registry/       Published source (single source of truth)
  ui/               Components
  blocks/           Blocks
  templates/        Page templates
  examples/         Examples used in the docs
src/components/     The site's own shell, doc rendering and home page
src/styles/         Line grid, color themes and doc styles
registry.json       Registry manifest
public/r/           Generated registry JSON
```

Doc previews, code views and `public/r/*.json` all read the same source in `src/registry/`.

## Tech stack

[Next.js](https://nextjs.org) 16 (App Router, static export) · [React](https://react.dev) 19 · [Tailwind CSS](https://tailwindcss.com) v4 · [shadcn/ui](https://ui.shadcn.com) · [Base UI](https://base-ui.com) · [Motion](https://motion.dev) · [Fumadocs](https://fumadocs.dev) (content layer) · [Shiki](https://shiki.style) · [Recharts](https://recharts.org)

## Contributing

Issues and pull requests are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the workflow and conventions (written in Simplified Chinese).

## License

[MIT](./LICENSE) © Travins
