import { Layout } from './Layout'
import { Activities } from './Activities'

export function ProfilePage() {
  return (
    <Layout>
      <h1>Profile</h1>
      <p className="leading-[1.8] pt-5 pb-10">
        ソフトウェアエンジニア。YAPC::Tokyo 2019、YAPC::Japan::Online 2022、YAPC::Hiroshima 2024でオーガナイザーを務めるなど、Perlコミュニティのカンファレンス運営に長く携わってきた。WebアプリケーションのパフォーマンスチューニングコンテストISUCONでは、第10回から第13回まで参考実装のPerl移植を担当。WEB+DB PRESSには「Perl Hackers Hub」など複数回寄稿している。事業会社ではエンジニア組織開発責任者を務めた。現在は自らの事業を立ち上げるべく動きながら、シグナルベースのOSSフレームワークBarefootJSを開発している。
      </p>
      <Activities />
    </Layout>
  )
}
