import { PageLayout } from './PageLayout'

const talks = [
  { slug: 'sample-talk', date: '2026-08-21', title: 'サンプルトーク' },
]

export function SlidesIndex() {
  return (
    <PageLayout className="slides-list">
      <h1>Slides</h1>
      <ul>
        {talks.map((talk) => (
          <li key={talk.slug}>
            <span className="date">{talk.date}</span>
            <a href={`/slides/${talk.slug}/`}>{talk.title}</a>
          </li>
        ))}
      </ul>
    </PageLayout>
  )
}
