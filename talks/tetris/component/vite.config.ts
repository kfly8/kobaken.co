import { defineConfig } from 'vite'
import { barefoot } from '@barefootjs/vite'
import { CSRAdapter } from '@barefootjs/client/csr-adapter'

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      // Object form (not a bare string) so it deep-merges with the
      // barefoot plugin's own `config()` hook, which unconditionally
      // sets `rollupOptions.input` to its auto-discovered components —
      // a plain-string `input` here gets clobbered by that hook instead
      // of merging. Naming this entry forces Rollup to split the shared
      // `@barefootjs/client/runtime` into a chunk both this file and the
      // compiled Tetris component import — required so `render()` (this
      // entry) and the component's own `hydrate()` registration (the
      // other entry) share the same runtime module instance/registry.
      input: { mount: 'mount.ts' },
    },
  },
  plugins: [
    barefoot({
      adapter: new CSRAdapter(),
      components: ['./components'],
    }),
  ],
})
