import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { barefoot } from '@barefootjs/hono/vite'

const HERE = dirname(fileURLToPath(import.meta.url))
const routerEntry = resolve(HERE, 'client/router-entry.ts')

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
    rollupOptions: {
      // `barefoot()` registers compiled `"use client"` components as entries
      // automatically (as a named-entry object); hand-written scripts like
      // the router bootstrap must be registered here explicitly, in the
      // same named-entry shape so Vite's config merge combines both
      // (see `assets` option below).
      input: { RouterEntry: routerEntry },
    },
  },
  plugins: barefoot({
    components: ['components'],
    templates: 'dist/components',
    assets: { RouterEntry: routerEntry },
  }),
})
