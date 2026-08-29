---
title: "Cloudflare Workers Tech Talks in Tokyo #8 に参加した"
date: "2026-08-29"
description: "TODO"
tags: ["diary", "meta"]
---

[Cloudflare Workers Tech Talks in Tokyo #8](https://workers-tech.connpass.com/event/400818/) に参加した。最高だった。勉強会の運営を10年以上してきたけれど、滅多に巡り会える場ではないと思った。yusukebeさんを始めとした多くの人の支えによるもので、場を作っていただいた皆さんに大変感謝をしたい。

---

ノベルティが色々可愛かった。娘たちに綿あめをあげたらたいへん喜んでいた。
<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">レゴ可愛い！ <a href="https://x.com/hashtag/workers_tech?src=hash&amp;ref_src=twsrc%5Etfw">#workers_tech</a> <a href="https://t.co/P4aqkCqKNp">pic.twitter.com/P4aqkCqKNp</a></p>&mdash; kobaken (@kfly8) <a href="https://x.com/kfly8/status/2093129185669882142?ref_src=twsrc%5Etfw">August 28, 2026</a></blockquote> <script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>

---

持ち帰ったコトを幾つか。

## 1. Workers Cache

Workers Cache は、Cache-Controlヘッダーをみて、プラットフォーム側で判断してキャッシュレスポンスを返す仕組みで、今年リリースされた機能。従来は、Cache APIを利用して、Worker内で処理する。プログラマティックに処理するには良いけれど、Worker Cacheの方が楽。キャッシュヒットすれば、CPU時間の課金はないし。

[sh1ma](https://x.com/sh1ma)さんのトークで、Cloudflare Containersのレスポンス高速化のために利用されていた。持ち帰って、このサイトのOGP生成を作った。satoriでHTML -> SVGを生成するWorkerを用意し、Worker Cache を仕込んだ。綺麗にハマった用途だと思う。

## 2. soniox

[soniox](https://soniox.com/) は、音声 <-> テキストの変換や翻訳を行うVoice APIを提供している会社。この分野に特化しているおかげか、Open APIなどと比べ、圧倒的に安く、速く、それでいて精度が高い。吉野家じゃん。サイト内のデモを見ると一目瞭然になっている。

[Ryuta Hamasaki](https://x.com/avosalmon)さんのトークで紹介された技術カンファレンスのライブ翻訳サービス[yoyo](https://yoyotranslate.app/)のバックエンドに利用されているそう。とても滑らかなデモで驚いた。Laravel++

## 3. pullfrog

[pullfrog](https://pullfrog.com/)は、CodeRabbitのようにGitHub上で動作するOSSのコーディングエージェント。AIを動かすのに自分の都合の良いAPI KEYを利用できる。

[LaPh](https://x.com/R0u9h)さんに教えてもらった。余談だけれど、LaPhさんが[オンプレGPUの話](https://fortee.jp/yapc-tokyo-2026/proposal/fe6f8345-2706-4408-952f-a7e003021e2f) をYAPC::Tokyo 2026のプロポーザルに出していた。気になる人はスターしてほしい。

[BarefootJS](https://barefootjs.dev/)に設定してみたので、しばらく使って様子をみてみたい。

## 4. 着想してから仕様ができるまで1日以内

宮本佳林さんのトークにエンジニアとして刺激を受けた人は少ないと思う。自分も刺激を受けた一人。最近は、個人開発をしていることもあり、この言葉が刺さった。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">宮本さん「着想してから仕様書ができるまで１日以内にする。でないと企画がボヤッとする。」<br><br>熟練度たかい <a href="https://x.com/hashtag/workers_tech?src=hash&amp;ref_src=twsrc%5Etfw">#workers_tech</a></p>&mdash; kobaken (@kfly8) <a href="https://x.com/kfly8/status/2092881321563742429?ref_src=twsrc%5Etfw">August 27, 2026</a></blockquote> <script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>

こういう刺さる言葉を持ち帰れるのは幸運なことで、感謝したい。

---

そんなわけで、Cloudflare Workers Tech Talks 最高でした！ありがとうございました！

