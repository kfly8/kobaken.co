---
title: "Peitho Studio - PeithoでHTMLスライドを書くアプリの紹介"
date: "2026-11-04"
description: "アプリにAIは組み込まなかった。代わりに、手元のAI Agentにコメントを待っていてもらうことにした。"
tags: ["peitho", "peitho-studio", "ai-agent"]
published: false
---

[YAPC::Tokyo 2026](https://yapcjapan.org/)に向けてスライド準備している人もいると思うので、スライドツールのアナウンスです。
[mizzy](https://x.com/gosukenator)さんのスライドツール[Peitho](https://peitho.gosu.ke/) をエンジンとした [Peitho Studio](https://peitho-studio.piconic.ai/) というアプリを作りました。

こちらが紹介スライド。HTMLスライドを使って「デモ用意したいな〜」「多言語対応したいな〜」という気持ちになってもらえたら嬉しいです！

<iframe src="/diary/2026-11-04-peitho-studio/slides/" loading="lazy" style="width:100%;aspect-ratio:16/9;border:0;"></iframe>

---

以下は雑談。作りについて。

- Tauri v2 のデスクトップアプリ
- Peithoの描画エンジン `peitho-core` を、サブプロセスではなくアプリの中に直接組み込んでいる
- フロントエンドは [BarefootJS](https://barefootjs.dev/) のCSRと UnoCSS
- エディタは CodeMirror で、Vimモードもある
- そして、レビューツールの [crit](https://crit.md/) を同梱している

一番面白かったのは、critの使い方だと思う。

### critをアプリとAI Agentとの橋渡しに使う

AI Agentにスライドを直してもらう仕組みを考えた時、最初に浮かんだのは、アプリにLLMを組み込む案だった。ただ、APIキーを入力してもらう手間があるし、端末の中で動くモデル(Apple Foundation Models など)では力が足りない。

なので、**ユーザーが既に使っている Claude Code や CodexなどのCoding Agentに頼むことにした。問題は、アプリから手元のAgentへ、どうやって依頼を届けるか。

ここで crit を使った。critは、Agentが書いたファイルに人がコメントし、Agentが直して返信する、という往復を回すためのツールで、[tomasz-tomczyk](https://github.com/tomasz-tomczyk/crit) さんが作っている。

具体的な流れはこうなっている。

1. Agentが `crit --no-open deck.md` を実行する。このコマンドは、人がレビューを終えるまで返ってこない。つまり**Agentはコメントを待っている**
2. Studio はプレビュー上で指したスライドの要素へのコメントを、critのローカルのHTTP APIに登録し、ラウンドの完了を送る
3. Agentの `crit` が返り、コメントと「直したら `crit comment --reply-to` で返信し、次のラウンドを待て」という指示が渡る
4. Agentがデッキを直して返信し、また待つ。Studio はcritのイベントを受け取り、返信を表示する

Studio は Agent を起動しないし、APIキーも持たない。最初に「このプロンプトをAgentに貼ってください」と案内するだけで、あとは Agent が自分から待ちに来てくれる。

UIは Studio、往復の仕組みは crit、という分担にした。

---

ハイ！

良かったら使ってみてください！

