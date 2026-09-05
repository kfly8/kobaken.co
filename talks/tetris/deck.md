---
lang: ja
aspect_ratio: 16:9
---

<!-- {"layout":"code"} -->
# BarefootJSはCSRもできる

- `@barefootjs/client/csr-adapter` でセットアップする

```ts
import { barefoot } from '@barefootjs/vite'
import { CSRAdapter } from '@barefootjs/client/csr-adapter'

export default defineConfig({
  plugins: [
    barefoot({ adapter: new CSRAdapter(), components: ['./components'] }),
  ],
})
```

---

<!-- {"layout":"code"} -->
# エントリーポイント

- `@barefootjs/client/runtime` でコンポーネントを `render` する

```ts
import { render } from '@barefootjs/client/runtime'
import './components/Tetris.tsx'

render(document.getElementById('tetris-root'), 'Tetris')
```

---

<!-- {"layout":"game"} -->
# Tetris with BarefootJS

← → で移動 / ↑ で回転 / ↓ でソフトドロップ / Space でハードドロップ
