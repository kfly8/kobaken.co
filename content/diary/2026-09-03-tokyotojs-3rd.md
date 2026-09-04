---
title: "ToKyoto.js #3 に初参加して、発表した"
date: "2026-09-04"
description: "懇親会で「なぜBarefootJSを作ったか」を聞かれた。ビール片手にちゃんと答えられた気がしないけれど、伝え方にはまだ迷いがある。"
tags: ["barefootjs", "meetup"]
published: true
---

9/3に、[ToKyoto.js #3](https://kyotojs.connpass.com/event/402321/)に初参加した。

初めての参加、久々の発表のせいか緊張したけれど、主催の[pastak](https://x.com/pastak)さんがゆるっとした雰囲気を作ってくれて、話しやすかったです！ありがとうございます！

<figure>
  <img src="wall.webp" alt="IVRyさんのオフィスにはでっかいロッククライミングの壁があった">
  <figcaption>IVRyさんのオフィスにはでっかいロッククライミングの壁があった。カッコイイ。</figcaption>
</figure>

---

幾つか。

## 1. V8のドキュメントを全部読む

[did0es](https://x.com/did0es)さんがV8のドキュメントを全部読むって話をしていた。こういう、**役に立つのかどうかは二の次でオモシロそうだからやってみる異常努力**の話は、やっぱり聞いてて楽しかった。後半も楽しみです。

## 2. なぜテストを書いてほしかったのか

[macchiitaka](https://x.com/macchiitaka)さんの話。こういう問いは、自分も考え直すきっかけになってありがたい。日頃は脳筋で「テストを書かない選択肢がない！」「テストしていたら容易に気づける問題で、人に迷惑かけるのは気まずい」くらいの生活をしているので。話は飛躍するけれど、おかげで、BarefootJSの価値の源泉はテストということに確信が持てました。SQLite のテストスイートとかの話を思い浮かべながら。

---

登壇についても少しだけ。資料はコチラ。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">昨日の <a href="https://x.com/hashtag/kyotojs?src=hash&amp;ref_src=twsrc%5Etfw">#kyotojs</a> の発表資料です。<br>&quot;BarefootJSの事例からみるテスト技法六選&quot;<a href="https://t.co/CuRHUfoQEB">https://t.co/CuRHUfoQEB</a></p>&mdash; kobaken (@kfly8) <a href="https://x.com/kfly8/status/2095681886274425307?ref_src=twsrc%5Etfw">September 4, 2026</a></blockquote> <script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>

懇親会にて、[coji](https://x.com/techtalkjp)さん、[shokai](https://x.com/shokai)さんに、なぜBarefootJSを作ったか聞いてもらえて嬉しかった。ビールを飲んでいたから、ちゃんと答えられた気がしないけれど。

一番は、個人開発を楽にしたかったから。自分はバックエンド技術は得意な一方、クライアント側は苦手。UI Componentが複雑に絡んだときに、reactiveな値を追いかけるのが自分には無理。認知負荷が高すぎる。BarefootJSは、signal情報をはじめUI Componentの情報をIRに詰め込んであり、signalが期待通り配線が出来ているか、購読されていないsignalはないか、などUI Componentの情報を分析できるようにAPIを公開している。そうすることで、コーディングエージェントが自律して、UI Componentを組み上げてくれて、嬉しい。

簡潔にまとめると、**個人開発の打数を増やす為、AI AgentにUI Componentの中身を見れる権限を渡したかった**から。

また、BarefootJSは、次のようなシチュエーションでも嬉しいはず。「はず」というのは、自身が実際にこういった案件をやっていないから。

- 1つは、バックエンドの資産はそのままで、TSXの表現力がほしい。
- 2つは、MPAの方がパフォーマンスが良い。GraphQL+Next.jsが挟んだ結果、レイヤーが挟まった分、どうしてもパフォーマンスが悪くなってしまった...みたいなとき。

この街の声は大変に嬉しかった。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">ある程度アプリに機能が出てきたのでリッチにしたかったタイミングだったんですが、HTMXだとちょい限界(UI/UXと主に僕のコードの視認コスト)だったのがよかった感じですね。<br><br>若干迷ったところとしてはディレクトリ構造どうするのが綺麗なのかは迷いました。(goだし趣味プロダクトなので雑に配置した)</p>&mdash; 八雲アナグラ (@AnaTofuZ) <a href="https://x.com/AnaTofuZ/status/2092878499992449046?ref_src=twsrc%5Etfw">August 27, 2026</a></blockquote> <script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>

既存のツールは素晴らしいし、大抵は巨人の肩に乗るのが正解だと思う。一方、
自分はBarefootJSの開発体験に助けられているので、人への伝え方に困っているので助けてほしい気持ちです🤔

---

はい！
というわけで、ToKyoto.js 楽しかったです！ありがとうございました！
