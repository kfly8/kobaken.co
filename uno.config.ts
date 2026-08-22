import { defineConfig, presetWind4 } from 'unocss'

// `unocss`/`unocss --watch` (the CLI, run as a separate process by `npm
// run dev`/`build`/`deploy`) reads `cli.entry.patterns`, not
// `content.filesystem` — both must list the same globs.
const scanGlobs = ['components/**/*.tsx', 'dist/components/**/*.tsx', 'server.tsx', 'renderer.tsx', 'blog/**/*.tsx']

export default defineConfig({
  presets: [presetWind4()],
  outputToCssLayers: true,
  // presetWind4's default `font-mono` stack (ui-monospace, SFMono-Regular,
  // ...) renders wider than the generic `monospace` keyword the fixed-width
  // date columns (Activities, Blog, Slides) were sized against — matching
  // it here keeps those columns from overflowing their width.
  theme: { font: { mono: 'monospace' } },
  content: { filesystem: scanGlobs },
  cli: { entry: { patterns: scanGlobs, outFile: 'public/static/uno.css' } },
})
