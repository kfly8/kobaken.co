import { css } from 'hono/css'

const talks = [
  { slug: 'sample-talk', date: '2026-08-21', title: 'サンプルトーク' },
]

export function SlidesIndex() {
  const ListClass = css`
    margin: 40px auto;
    max-width: 800px;
    padding: 0 20px;

    & li {
      display: flex;
      align-items: baseline;
      margin: 20px 0;
    }

    & .date {
      white-space: nowrap;
      font-weight: 300;
      font-family: monospace;
      margin-right: 13px;
      width: 80px;
      text-align: right;
    }
  `

  return (
    <section className={ListClass}>
      <h1>Slides</h1>
      <ul>
        {talks.map((talk) => (
          <li key={talk.slug}>
            <span className="date">{talk.date}</span>
            <a href={`/slides/${talk.slug}/`}>{talk.title}</a>
          </li>
        ))}
      </ul>
    </section>
  )
}
