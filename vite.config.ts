import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { barefoot } from '@barefootjs/hono/vite'

const HERE = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: '/components/',
  resolve: {
    // Mirrors tsconfig.json's `@/components/*` path mapping — Vite's
    // dev-server dependency pre-scan parses raw source directly (before
    // this plugin's own `transform` hook runs) and has no notion of
    // tsconfig `paths` without this. Points at the SOURCE tree (not
    // `dist/components`, the compiled SSR output tsconfig also maps).
    alias: {
      '@/components': resolve(HERE, 'components'),
    },
  },
  // `build.outDir` (`public/components`) is itself a subdirectory of
  // `public/` — Vite's own default `publicDir` behavior would copy
  // `public/`'s OTHER contents (static/, favicon, etc.) into
  // `public/components` too, which nothing reads (Workers Assets already
  // serves them straight from `public/` itself) and which `emptyOutDir`
  // would then immediately churn on the next build.
  publicDir: false,
  build: {
    outDir: 'public/components',
    emptyOutDir: true,
  },
  plugins: barefoot({
    components: ['components'],
    templates: 'dist/components',
  }),
})
