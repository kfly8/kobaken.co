import { css } from 'hono/css'

import { PageLayout } from './PageLayout'
import { Activities } from './activities'

export function ProfilePage() {
  const BioClass = css`
    line-height: 1.8;
    padding: 20px 0 40px;
  `

  return (
    <PageLayout>
      <h1>Profile</h1>
      <p className={BioClass}>
        ソフトウェアエンジニア。YAPC::Tokyo 2019、YAPC::Japan::Online 2022、YAPC::Hiroshima 2024でオーガナイザーを務めるなど、Perlコミュニティのカンファレンス運営に長く携わってきた。WebアプリケーションのパフォーマンスチューニングコンテストISUCONでは、第10回から第13回まで参考実装のPerl移植を担当。WEB+DB PRESSには「Perl Hackers Hub」など複数回寄稿している。事業会社ではエンジニア組織開発責任者を務めた。現在は自らの事業を立ち上げるべく動きながら、シグナルベースのOSSフレームワークBarefootJSを開発している。
      </p>
      <Activities />
    </PageLayout>
  )
}
