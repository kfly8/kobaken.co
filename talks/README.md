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

## OGP画像

共有カードの中身はスライド1枚目。`public/slides/<slug>/index.html`（Workers Assetsが静的配信するページ本体）のOGP/Twitterカードのタグは、`scripts/generate-slides.mjs` がビルドの度に自動で埋め込む（タイトルと説明は `manifest.json` の1枚目の見出しと本文から）。`?slide=2` 以降のURLも、同じ1枚目のカードになる。

カード画像は `/slides/<slug>/og.png`。Workers Assetsではなく Worker（`slides/ogp.ts`）が返し、ブログ・日記のカード画像と同じ `Cache-Control` で Cloudflare のキャッシュに載る。中身は、ビルドが1枚目を描いた `public/slides/<slug>/og-cover-<hash>.png`（`<hash>` は1枚目のHTMLとCSSから計算し、ETagにも使う）。

- 1枚目が変わると、`npm run build`/`dev` が描き直す（peitho export pdf → sips、数秒）。1枚目が変わらなければ何もしない
- 描き直した `og-cover-<hash>.png` は通常どおり `git add` してコミットする（古いものはビルドが消す）
- peitho か sips が無い環境（CI など）では描き直さず、警告を出して前回の画像を使い続ける
