---
title: "Peitho Studio —— 触れるHTMLスライドを作ろう"
date: "2026-11-04"
description: "TODO"
tags: ["peitho", "peitho-studio", "ai-agent"]
published: true
---

[YAPC::Tokyo 2026](https://yapcjapan.org/)に向けてスライド準備している人もいると思うので、スライドツールの紹介です。
「デモを用意したい」「多言語対応したい」といった気持ちを作れたら嬉しいです😀

<iframe src="/slides/peitho-studio/" loading="lazy" style="width:100%;aspect-ratio:16/9;border:0;"></iframe>

スライドの1ページ目から早速おねがいになってしまいますが、右上のボタンを押して「英語」「日本語」が切り替わることを確かめてほしいです。スライドがHTMLでできているので、普通のWebアプリと同じ多言語対応をしています。ゲストのLarry Wallにスライドを読んでもらうなら、絶対対応していきたいですね!!

いや、冗談っぽい言い方をしましたが、[tagomorisさんが2015年に「ソフトウェア技術についてのスライドは英語で書こう」とブログに書かれていた](https://tagomoris.hatenablog.com/entry/2015/06/01/210425)ように潜在読者は増えますし、AIがある今なら対応の敷居は低くなっているので、ぜひ選択肢にいれていきたいですね。

<iframe src="/slides/peitho-studio/?slide=2" loading="lazy" style="width:100%;aspect-ratio:16/9;border:0;"></iframe>

このスライドは、[mizzy](https://x.com/gosukenator)さんのスライドツール [Peitho](https://peitho.gosu.ke/) をエンジンとした [Peitho Studio](https://peitho-studio.piconic.ai/) という拙作アプリで作っています。

せっかくならPeitho Studioを使ってほしい気持ちもありますが、そもそも **HTMLスライドはいいぞ！** ということを訴えたいです。

<iframe src="/slides/peitho-studio/?slide=3" loading="lazy" style="width:100%;aspect-ratio:16/9;border:0;"></iframe>

従来のスライドと違って、**HTMLのスライドは触って動かせる** のが決定的に違うところだと思っています。前述の多言語対応もそうですし、このスライドなら、左のスライドバーを触って粒子のアニメーションを動かせます。PDFのスライドだとデモは割愛されがちで、参加者だけのお楽しみ要素になりがちですね😀

<iframe src="/slides/peitho-studio/?slide=4" loading="lazy" style="width:100%;aspect-ratio:16/9;border:0;"></iframe>

触れるHTMLスライドの例をもう一つ。小学生の娘に算数を教えるとき、偶にこういった動くデモを用意します。すると、娘の納得感が俄然上がるんですよね。**簡潔にまとめられた要点をめくりながら伝える** スライドという媒体が元々もつ特性に、プラスαの価値を足せているなーと。

<iframe src="/slides/peitho-studio/?slide=5" loading="lazy" style="width:100%;aspect-ratio:16/9;border:0;"></iframe>

HTMLスライド自体は以前からあるもので、今このタイミングで言及する理由は、AIですね。AIは殊更、HTMLが得意でお願いした通り作ってくれますね。

Peitho Studioの設計系譜は、👆️のスライドの通りで、k1Low/deck がコンテンツ分離を確立し、mizzy/Peitho が表現をHTML-nativeにしてAIフレンドリーに昇華したところを、ただただ楽に使えないかと安直に発想したプロダクトです。Google Slidesほど万人向けでなくとも、身近なエンジニアの人に、楽に使えると思ってもらえたら良いなと思っています。

<video src="https://peitho-studio.piconic.ai/studio-demo.mp4" controls playsinline preload="metadata" aria-label="Peitho Studio demo" style="width:100%;border-radius:8px">
  <a href="https://peitho-studio.piconic.ai/studio-demo.mp4">Watch the Peitho Studio demo</a>
</video>

実際にPeitho Studioでスライド編集している様子です。Markdownでコンテンツを書いて、スライドのスタイルをいい感じにしてほしい！とコメントをすると、後ろで動いているCoding Agentが調整してくれている様子です。どのページのどの要素を調整したいかAIに指示するのは面倒ですが、Peitho Studioはそういった面倒をみます。

<iframe src="/slides/peitho-studio/?slide=7" loading="lazy" style="width:100%;aspect-ratio:16/9;border:0;"></iframe>

よかったら、Peitho Studioで HTMLスライドを作ってみてほしいです！

---

以下は雑談。Peitho Studioの作りについて。

- Tauri v2 のデスクトップアプリ
- Peithoの描画エンジン peitho-core 。サブプロセスではなくアプリの中に直接組み込んでいる
- フロントエンドは [BarefootJS](https://barefootjs.dev/) のCSRと UnoCSS
- エディタは CodeMirror。Vimモードもある(大事)
- リリース管理は、[Songmu/tagpr](https://github.com/Songmu/tagpr)
- コードのリファクタリングに [moznion/cccc](https://github.com/moznion/cccc)で、Cognitive Complexity をCIでチェック
- AI Agentとの連携に、[crit](https://crit.md/) を同梱している

一番面白かったのは、critの使い方だと思います。

### アプリとAI Agentとの連携はどうするか？

AI Agentにスライドを直してもらう仕組みを設計するとき、最初に浮かんだのは、アプリにAPIキーを用意しAPIを叩いてもらうことでした。ですが、ユーザーからするとAPIキー発行は手間(?)だし、安全性も気になるのでやめました。

APIキーを利用せず、ユーザーが既に使っている Claude Code や CodexなどのCoding Agentに頼む方法はないか悩んで、閃いたのが、crit でした。critは、ファイルを対象としたレビューでAgentと人を橋渡しするツールで、元々はGitHubのPRっぽくpromptできるツールとして人気になっていると思います。

Peitho Studioでの具体的な流れはこうなっています。

![Peitho Studio and a Coding Agent exchange reviews through crit and work on the same local deck files.](crit-bridge.svg)

これで、Studio 自体が Agent を持たず、APIキーも持たないです。最初に「このプロンプトをAgentに貼ってください」と案内するだけで、Agent がユーザーからの指示を待ってくれます。UIは Studio、連携は crit、という分担ができました。

この仕組みは、スライドツールだけでなく、**ローカルアプリとCoding Agentを繋ぐのに使える一般解** なので、面白いと思います。

---

はい。以上です！YAPC楽しみですね！

良かったら使ってみてください！
