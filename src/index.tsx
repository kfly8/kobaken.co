import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono()

const Profile = () => {
  return (
    <>
      <section class="profile">
          <img class="icon" src="/static/img/kobaken.jpg" alt="icon" />
          <div>
            <h1 class="name">kobaken</h1>
            <p class="tagline">Software Engineer | Engineering Manager | Tech Conference Organizer</p>
            <ul class="sns-links">
              <li><a href="https://kfly8.hatenablog.com/"><i class="icon-rss"></i><span class="sr-only">Blog</span></a></li>
              <li><a href="https://github.com/kfly8"><i class="icon-github"></i><span class="sr-only">GitHub</span></a></li>
              <li><a href="https://twitter.com/kfly8"><i class="icon-twitter"></i><span class="sr-only">Twitter</span></a></li>
              <li><a href="mailto:kentafly88@gmail.com"><i class="icon-mail"></i><span class="sr-only">Mail</span></a></li>
            </ul>
          </div>
      </section>
    </>
  )
}

const ToggleTheme = () => {
  return (
    <>
      <div id="toggle-theme">
        <i class="switch-dark icon-moon"></i>
        <i class="switch-light icon-sun"></i>
      </div>
    </>
  )
}

const Activities = () => {
  const activities = [
    { date: '2015-08-22', url: 'https://speakerdeck.com/kfly8/kong-jian-qing-bao-tan-suo-ji-chu-lun', title: '空間情報探索基礎論 | YAPC::Asia 2015' },
    { date: '2016-10-24', url: 'https://speakerdeck.com/kfly8/yun-yong-5nian-mu-falsewei-zhi-gemufalsexin-mi-purodakutokai-fa', title: '運用５年目の位置ゲームの新米プロダクト開発 #pmconfjp' },
    { date: '2018-11-13', url: 'https://tech.mobilefactory.jp/entry/2018/11/13/120500', title: '社内ISUCONをオリジナル問題で開催しました' },
    { date: '2018-10-24', url: 'https://kfly8.hatenablog.com/entry/2018/10/24/133501', title: 'WEB+DB PRESS vol.107 「Perl Hackers Hub」 第52回「Perlで堅牢な開発」に寄稿しました' },
    { date: '2019-02-05', url: 'https://blog.yapcjapan.org/entry/2019/02/05/160000', title: 'YAPC::Tokyoを終えて' },
    { date: '2019-09-09', url: 'https://tech.mobilefactory.jp/entry/2019/09/09/180000', title: 'The Perl Conference 2019 in Pittsburghに行ってきた' },
    { date: '2020-07-21', url: 'https://speakerdeck.com/kfly8/ming-ri-karadekiruxin-ren-falseonbodeingugaido',  title: '明日からできる新人のオンボーディングガイド | #kichijojipm 23' },
    { date: '2021-03-30', url: 'https://speakerdeck.com/kfly8/yan-xiu-haibentodenakukomiyuniteizuo-ri', title: '研修はイベントでなくコミュニティ作り | #kichijojipm 26' },
    { date: '2021-12-15', url: 'https://kfly8.hatenablog.com/entry/2021/12/15/213610', title: 'WEB+DB Press Vol.126で「ISUCONの実装から最近のPerlを学ぶ」という題の記事を寄稿しました' },
    { date: '2021-12-25', url: 'https://tech.mobilefactory.jp/entry/2021/12/25/000000', title: '技術ブログが書ける開発をする'},
    { date: '2022-06-30', url: 'https://tech.mobilefactory.jp/entry/2022/06/30/200000', title: 'Perlの技術研修' },
    { date: '2022-07-22', url: 'https://tech.mobilefactory.jp/entry/2022/07/22/184000', title: 'OSSのスポンサーを始めるときに、技術広報目線で考えたこと' },
    { date: '2022-08-30', url: 'https://kfly8.hatenablog.com/entry/2022/08/30/185300', title: 'エンジニアのためのお祭りの技術カンファレンスをオンラインで実施する｜YAPC::Japan::Onlineの場合' },
    { date: '2023-03-22', url: 'https://kfly8.hatenablog.com/entry/2023/03/22/015343', title: 'YAPC::Kyoto 2023 の運営をしました' },
    { date: '2023-06-17', url: 'https://kfly8.hatenablog.com/entry/2023/06/17/133950', title: '最近プログラミングが楽しい' },
    { date: '2023-08-26', url: 'https://kfly8.hatenablog.com/entry/2023/08/26/214805', title: 'ドキュメントでプログラミング言語に貢献する' },
    { date: '2023-11-09', url: 'https://kfly8.hatenablog.com/entry/2023/11/09/092623', title: 'perldoc.jp のこの1年の変化まとめと、次の1年' },
  ]

  return (
    <>
      <section class="activities">
        <h2>Activities</h2>
        <ul>
          { activities.reverse().map((activity) => (
            <li><span class="date">{activity.date}</span> <a href={activity.url}>{activity.title}</a></li>
          ))}
        </ul>
      </section>
    </>
  )
}

app.get('*', renderer)

app.get('/', (c) => {
  return c.render(
    <>
      <ToggleTheme />
      <div class="main">
        <Profile />
        <Activities />
      </div>
    </>,
    {
        title: 'kobaken',
        description: "I'm a software engineer and preparing to start my own business. Event organizer for YAPC::Tokyo 2019, YAPC::Japan::Online 2022, and YAPC::Hiroshima 2024."
    }
  )
})

export default app
