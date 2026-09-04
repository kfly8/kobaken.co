---
title: "Cloudflare Workers Tech Talks in Tokyo #8 に参加した。最高だった。"
date: "2026-08-30"
description: "宮本佳林さんが、さらっと言っていた。『着想してから仕様書ができるまで1日以内にする』。何がそう言わせるんだろう。"
tags: ["diary"]
published: true
---

8/27に[Cloudflare Workers Tech Talks in Tokyo #8](https://workers-tech.connpass.com/event/400818/) に参加した。最高だった。勉強会の運営を10年以上してきたけれど、滅多に巡り会えない奇跡的な場だと思った。[yusukebe](https://x.com/yusukebe)さんを始めとした多くの人の支えによるもの。場を作っていただいた方々に大変感謝をしたい。

<figure>
  <img src="lego.webp" alt="もらったレゴ">
  <figcaption>ノベルティが可愛い。</figcaption>
</figure>

---

持ち帰ったコトを幾つか。

## 1. Workers Cache

Workers Cache は、Cache-Controlヘッダーをみて、プラットフォーム側で判断してキャッシュレスポンスを返す仕組みで、今年リリースされた機能。従来は、Cache APIを利用して、Worker内で処理する。これはプログラマティックに処理するには良いけれど、Workers Cacheの方がキャッシュヒットすれば、CPU時間の課金はなく、楽。

[sh1ma](https://x.com/sh1ma)さんのトークで、Cloudflare Containersのレスポンス高速化のために利用されていた。持ち帰って、このサイトのOGP生成を作った。satoriでHTML → SVGを生成するWorkerを用意し、Worker Cache を仕込んだ。つまり、OGPを動的生成後、キャッシュされたOGPをプラットフォーム側が返し続けてくれる。綺麗にハマった用途だと思う。

## 2. soniox

[soniox](https://soniox.com/) は、音声↔テキストの変換や翻訳を行うVoice APIを提供している。この分野に特化しているおかげか、デモを見る限りOpenAIなどと比べ、圧倒的に安く速く、それでいて精度が高い。日本語を含む複数言語に対応していることも強み。

[Ryuta Hamasaki](https://x.com/avosalmon)さんが作ったライブ翻訳サービス[YOYO](https://yoyotranslate.app/)のバックエンドに利用されているそう。とても滑らかな翻訳で驚いた。（発表本筋の Durable Objects の話でなくてスイマセン。Durable Objects めちゃくちゃ便利ですよね。）

## 3. pullfrog

[pullfrog](https://pullfrog.com/)は、CodeRabbitのようにGitHub上で動作するOSSのコーディングエージェント。Claudeサブスクのトークンなど指定して自分の都合の良いモデルを利用できる。

[LaPh](https://x.com/R0u9h)さんに教えてもらった。ハーネスが良いそうだけれど、[BarefootJS](https://barefootjs.dev/)に設定してみたので、様子をみてみたい。

余談だけれど、LaPhさんにYAPCのCfPを薦めたら、早速、[オンプレGPUの話](https://fortee.jp/yapc-tokyo-2026/proposal/fe6f8345-2706-4408-952f-a7e003021e2f) を出していた。素早い。素敵。

## 4. 着想してから仕様ができるまで1日以内

[宮本佳林](https://x.com/karin__miyamoto)さんのトークに刺激を受けた人は少なくないと思う。自分も刺激を受けた一人。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">宮本さん「着想してから仕様書ができるまで１日以内にする。でないと企画がボヤッとする。」<br><br>熟練度たかい <a href="https://x.com/hashtag/workers_tech?src=hash&amp;ref_src=twsrc%5Etfw">#workers_tech</a></p>&mdash; kobaken (@kfly8) <a href="https://x.com/kfly8/status/2092881321563742429?ref_src=twsrc%5Etfw">August 27, 2026</a></blockquote> <script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>

宮本さんはサラッとこんなことを言っていた。割り切った言葉が何気ない言葉として出てくるのは、真剣に向き合い続けてきたからだと想像した。カッコイイと思った。こういう言葉を現地で聞けて、運が良かったと思う。

---

はい！  
というわけで、Cloudflare Workers Tech Talks 最高でした。ありがとうございました！
