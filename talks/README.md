# Slides (`/slides`)

Slides are authored with [peitho](https://github.com/mizzy/peitho) and built into `public/slides/<slug>/`. Workers Assets serves the slide fragments, CSS, fonts, and images. The Worker serves the deck HTML with metadata for the requested slide.

## 新しいトークを作る

```bash
# 1. ソース一式をスキャフォールド（talks/<slug>/ 配下に deck.md, layouts/, css/ が生成される）
peitho new talks/<slug>

# 2. talks/<slug>/deck.md を編集する
#    - スライド本文は Markdown、`---` でスライド区切り
#    - スピーカーノートは非JSONのHTMLコメント `<!-- ... -->` として書く

# 3. ビルド（スピーカーノートは成果物に含まれない設計）
peitho build talks/<slug>/deck.md --out public/slides/<slug>

# 4. コンタミネーションチェック(スピーカーノート等が漏れていないかの検査ゲート)
peitho publish --dist public/slides/<slug> -- true
```

`public/slides/<slug>/` を通常どおり `git add` してコミットする。

## `/slides` 一覧への追加

`/slides` 一覧は `talks/<slug>/talk.json` と `public/slides/<slug>/manifest.json`（ビルド成果物、タイトルはdeck自身から）から `scripts/generate-slides.mjs` が自動生成する（`dist/slides.ts`、blog/diaryのpostsと同じ仕組み）。`components/SlidesIndex.tsx` を手で編集する必要はない。

```bash
# talks/<slug>/talk.json に日付を書く（peithoのdeck.md frontmatterはキーが固定されており date を持てないため）
echo '{ "date": "YYYY-MM-DD" }' > talks/<slug>/talk.json
```

`talk.json` を忘れたまま `manifest.json` だけビルド済みの状態にすると、`npm run build`/`dev` は静かに一覧から漏らすのではなく**エラーで止まる**（何を作ればいいかのコマンド付き）。`talk.json` も通常どおり `git add` してコミットする。

## Open Graph images

Share `/slides/<slug>/N` to show that slide's title, text, and image. Slide numbers start at 1. The deck root selects the first slide. Invalid or out-of-range numbers return 404. Legacy `?slide=N` URLs and `index.html` redirect to numbered paths. The Worker writes Open Graph and Twitter metadata into the HTML response, so crawlers do not need JavaScript. Viewer navigation also updates the numbered path.

`scripts/generate-slides.mjs` reads the published manifests into `dist/slides.ts`. It records the canvas dimensions and each slide's title, description, source, and image version. The version covers all files in the built deck, including its viewer, CSS, fonts, and assets. Rebuilding the registry after a deck change gives its images new URLs.

`/slides/<slug>/N/og-<version>.png` renders the existing Peitho viewer with Cloudflare Browser Run and captures the selected slide at the deck's canvas dimensions. `/slides/<slug>/og.png` continues to serve the first slide. Local static files come from the `ASSETS` binding. The renderer waits for the selected slide, fonts, and images before taking the screenshot. Images are generated only when requested; builds no longer run `peitho export pdf` or `sips`, and no generated PNG needs to be committed.

The `BROWSER` binding and `nodejs_compat` flag in `wrangler.jsonc` support screenshot generation. Run `npm run cf-typegen` after changing bindings. `wrangler dev` uses a local browser; production uses Browser Run.

Workers Cache is enabled in `wrangler.jsonc`. PNG responses are public for one week with stale-while-revalidate for 30 days. Cache hits return the stored response without executing the Worker or launching a browser. ETags allow unchanged images to return 304 without rendering. HTML responses have a five-minute shared-cache lifetime. Invalid requests and rendering failures carry `Cache-Control: no-store`.

With `wrangler dev` running, run `npm run check:slides -- http://localhost:8787` to check metadata, redirects, validation, and cache headers. Add `--images` to generate PNGs for the cover, page 2, the last page, embedded demos, and older decks. The image check verifies PNG signatures, canvas dimensions, and distinct output, and saves previews in the system temporary directory. Workers Cache hits must be checked after deployment using the `Cf-Cache-Status` header.
