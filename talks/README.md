# Slides (`/slides`)

登壇スライドは [peitho](https://github.com/mizzy/peitho) で作成し、ビルド成果物を `public/slides/<slug>/` に静的配信する。Hono/BarefootJSのルーティングは介在しない（Workers Assetsがそのまま配信する）。

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
