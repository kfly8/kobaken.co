import { Layout } from './Layout'
import { Activities } from './Activities'
import { type Lang, switchLink } from '../i18n'

const BIO: Record<Lang, string> = {
  en: 'Software engineer. I have long helped run conferences in the Perl community, as an organizer of YAPC::Tokyo 2019, YAPC::Japan::Online 2022 and YAPC::Hiroshima 2024, among others. For ISUCON, a web application performance tuning contest, I ported the reference implementation to Perl for the 10th through the 13th contests. I have written for WEB+DB PRESS several times, including its "Perl Hackers Hub" series. At an operating company, I led the development of its engineering organization. Now I am working toward starting my own business while developing BarefootJS, a signal-based open-source framework.',
  ja: 'ソフトウェアエンジニア。YAPC::Tokyo 2019、YAPC::Japan::Online 2022、YAPC::Hiroshima 2024でオーガナイザーを務めるなど、Perlコミュニティのカンファレンス運営に長く携わってきた。WebアプリケーションのパフォーマンスチューニングコンテストISUCONでは、第10回から第13回まで参考実装のPerl移植を担当。WEB+DB PRESSには「Perl Hackers Hub」など複数回寄稿している。事業会社ではエンジニア組織開発責任者を務めた。現在は自らの事業を立ち上げるべく動きながら、シグナルベースのOSSフレームワークBarefootJSを開発している。',
}

export function ProfilePage(props: { lang: Lang }) {
  const switchTo = switchLink('/profile', props.lang)
  return (
    <Layout active="profile" lang={props.lang} switchHref={switchTo.href} switchLabel={switchTo.label} switchLang={switchTo.lang}>
      <h1>Profile</h1>
      <p className="leading-[1.8] pt-5 pb-10">
        {BIO[props.lang]}
      </p>
      {/* The titles are those of the talks and articles, most in Japanese. */}
      <div lang="ja">
        <Activities />
      </div>
    </Layout>
  )
}
