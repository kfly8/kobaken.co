import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono()

const Profile = () => {
  return (
    <>
      <section id="profile">
          <img class="icon" src="/static/img/kobaken.jpg" alt="icon" />
          <div>
            <h1 class="name">kobaken</h1>
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

const Tagline = () => {
  return (
    <>
      <div id="tagline">
        Software Engineer | Engineering Manager | Tech Conference Organizer
      </div>
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
    { date: '2020-08-30', url: 'https://github.com/isucon/isucon10-qualify/pull/117', title: 'ISUCON10で参考実装のPerl移植をしました' },
    { date: '2021-03-30', url: 'https://speakerdeck.com/kfly8/yan-xiu-haibentodenakukomiyuniteizuo-ri', title: '研修はイベントでなくコミュニティ作り | #kichijojipm 26' },
    { date: '2021-08-13', url: 'https://github.com/isucon/isucon11-qualify/pull/1099', title: 'ISUCON11で参考実装のPerl移植をしました' },
    { date: '2021-12-15', url: 'https://kfly8.hatenablog.com/entry/2021/12/15/213610', title: 'WEB+DB Press Vol.126で「ISUCONの実装から最近のPerlを学ぶ」という題の記事を寄稿しました' },
    { date: '2021-12-25', url: 'https://tech.mobilefactory.jp/entry/2021/12/25/000000', title: '技術ブログが書ける開発をする'},
    { date: '2022-06-30', url: 'https://tech.mobilefactory.jp/entry/2022/06/30/200000', title: 'Perlの技術研修' },
    { date: '2022-07-14', url: 'https://github.com/isucon/isucon12-qualify/pull/164', title: 'ISUCON12で参考実装のPerl移植をしました' },
    { date: '2022-07-22', url: 'https://tech.mobilefactory.jp/entry/2022/07/22/184000', title: 'OSSのスポンサーを始めるときに、技術広報目線で考えたこと' },
    { date: '2022-08-30', url: 'https://kfly8.hatenablog.com/entry/2022/08/30/185300', title: 'エンジニアのためのお祭りの技術カンファレンスをオンラインで実施する｜YAPC::Japan::Onlineの場合' },
    { date: '2023-03-22', url: 'https://kfly8.hatenablog.com/entry/2023/03/22/015343', title: 'YAPC::Kyoto 2023 の運営をしました' },
    { date: '2023-06-17', url: 'https://kfly8.hatenablog.com/entry/2023/06/17/133950', title: '最近プログラミングが楽しい' },
    { date: '2023-08-26', url: 'https://kfly8.hatenablog.com/entry/2023/08/26/214805', title: 'ドキュメントでプログラミング言語に貢献する' },
    { date: '2023-11-09', url: 'https://kfly8.hatenablog.com/entry/2023/11/09/092623', title: 'perldoc.jp のこの1年の変化まとめと、次の1年' },
    { date: '2023-11-25', url: 'https://github.com/isucon/isucon13', title: 'ISUCON13で参考実装のPerl移植をしました' },
  ]

  const formatMMDD = (date: Date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = (date.getDate()).toString().padStart(2, '0');
    return `${month}-${day}`
  }

  const displayActivities = activities.reverse().map((activity, index, arr) => {
    const currentDate  = new Date(activity.date);
    const previousDate = index > 0 ? new Date(arr[index - 1].date) : null;
    const displayDate  = previousDate && currentDate.getFullYear() === previousDate.getFullYear() ? formatMMDD(currentDate) : activity.date

    return { ...activity, displayDate }
  });

  return (
    <>
      <section id="activities">
        <h2>Activities</h2>
        <ul>
          { displayActivities.map((activity) => (
            <li>
              <span class="date">{activity.displayDate}</span>
              <span class="title"><a href={activity.url}>{activity.title}</a></span>
            </li>
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
      <Tagline />
      <div id="main">
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
