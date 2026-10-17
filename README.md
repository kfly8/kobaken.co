## What's this?

kobaken's homepage

## Prerequisites

スライド（`/slides`）を作成・更新するには [peitho](https://github.com/mizzy/peitho)（Markdownを起点にHTMLネイティブなプレゼンテーションを生成するツール）が必要です。

```bash
brew install mizzy/tap/peitho
```

スライドの作成・公開手順は [`talks/README.md`](./talks/README.md) を参照してください。

## 英語と日本語

ページはすべて言語つきの URL を持つ（`/en/...` と `/ja/...`）。言語のない URL（`/`、`/blog/<slug>` など）は入口で、読む人の言語（`?lang=` で選んだもの → cookie → `Accept-Language` → 英語の順）のページへ 302 で案内する。

記事は `content/<blog|diary>/` に言語ごとのファイルで置く。

- `<slug>.en.md` と `<slug>.ja.md` は、同じ記事の英語版と日本語版。どちらか片方だけでもよい
- 言語のない `<slug>.md` は日本語として扱う（英語版を作る前からある記事）
- 画像などは言語によらず `content/<blog|diary>/<slug>/` に置く

一覧は、その言語の版があればそれを、なければもう一方の言語の版を（言語名を添えて）並べる。両方の版がある記事にだけ、ヘッダーに言語の切り替えが出る。
