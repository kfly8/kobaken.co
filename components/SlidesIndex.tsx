import { Layout } from './Layout'

const talks = [
  { slug: 'sample-talk', date: '2026-08-21', title: 'サンプルトーク' },
]

export function SlidesIndex() {
  return (
    <Layout className="slides-list">
      <h1>Slides</h1>
      <ul>
        {talks.map((talk) => (
          <li key={talk.slug}>
            <span className="date">{talk.date}</span>
            <span className="title"><a href={`/slides/${talk.slug}/`}>{talk.title}</a></span>
          </li>
        ))}
      </ul>
    </Layout>
  )
}
