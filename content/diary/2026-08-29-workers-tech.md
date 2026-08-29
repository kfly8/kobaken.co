---
title: "Cloudflare Workers Tech Talks in Tokyo #8 に参加した"
date: "2026-08-29"
description: "TODO"
tags: ["diary", "meta"]
published: true
---

[Cloudflare Workers Tech Talks in Tokyo #8](https://workers-tech.connpass.com/event/400818/) に参加した。最高だった。勉強会の運営を10年以上してきた経験があるけれど、滅多に巡り会えない奇跡的な場だと思った。[yusukebe](https://x.com/yusukebe)さんを始めとした多くの人の支えによるもの。場を作っていただいた方々に大変感謝をしたい。

<figure>
<img src="lego.png" alt="もらったレゴ">
<figcaption>ノベルティが可愛かった。娘たちに綿あめをあげたら、たいへん喜んでいた。</figcaption>
</figure>

---

持ち帰ったコトを幾つか。

## 1. Workers Cache

Workers Cache は、Cache-Controlヘッダーをみて、プラットフォーム側で判断してキャッシュレスポンスを返す仕組みで、今年リリースされた機能。従来は、Cache APIを利用して、Worker内で処理する。これはプログラマティックに処理するには良いけれど、Worker Cacheの方が楽。キャッシュヒットすれば、CPU時間の課金はないし。

[sh1ma](https://x.com/sh1ma)さんのトークで、Cloudflare Containersのレスポンス高速化のために利用されていた。持ち帰って、このサイトのOGP生成を作った。satoriでHTML -> SVGを生成するWorkerを用意し、Worker Cache を仕込んだ。綺麗にハマった用途だと思う。

## 2. soniox

[soniox](https://soniox.com/) は、音声 <-> テキストの変換や翻訳を行うVoice APIを提供している会社。この分野に特化しているおかげか、Open APIなどと比べ、圧倒的に安く、速く、それでいて精度が高い。吉野家じゃん。サイト内のデモを見ると一目瞭然になっている。

[Ryuta Hamasaki](https://x.com/avosalmon)さんが作ったライブ翻訳サービス[yoyo](https://yoyotranslate.app/)のバックエンドに利用されているそう。とても滑らかな翻訳で驚いた。

## 3. pullfrog

[pullfrog](https://pullfrog.com/)は、CodeRabbitのようにGitHub上で動作するOSSのコーディングエージェント。AIを動かすのに自分の都合の良いAPI KEYを利用できる。

[LaPh](https://x.com/R0u9h)さんに教えてもらった。ハーネスが良いそうだけれど、[BarefootJS](https://barefootjs.dev/)に設定してみたので、様子をみてみたい。

余談だけれど、LaPhさんにYAPCのCfP出したら？と焚き付けたら、早速、[オンプレGPUの話](https://fortee.jp/yapc-tokyo-2026/proposal/fe6f8345-2706-4408-952f-a7e003021e2f) を出していた。素早い。すばらしい。気になる人はスターしてほしい。

## 4. 着想してから仕様ができるまで1日以内

宮本佳林さんのトークに刺激を受けた人は少なくないと思う。自分も刺激を受けた一人。最近は個人開発をしていることもあり、この言葉が刺さった。こういう刺さる言葉を持ち帰れるのは幸運なことだ。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">宮本さん「着想してから仕様書ができるまで１日以内にする。でないと企画がボヤッとする。」<br><br>熟練度たかい <a href="https://x.com/hashtag/workers_tech?src=hash&amp;ref_src=twsrc%5Etfw">#workers_tech</a></p>&mdash; kobaken (@kfly8) <a href="https://x.com/kfly8/status/2092881321563742429?ref_src=twsrc%5Etfw">August 27, 2026</a></blockquote> <script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>


---

はい！  
というわけで、Cloudflare Workers Tech Talks 最高でした！ありがとうございました！
