import { SLIDES } from '../dist/slides'
import { Layout } from './Layout'

export function SlidesIndex() {
  return (
    <Layout className="slides-list" active="slides">
      <h1>Slides</h1>
      <ul>
        {SLIDES.map((talk) => (
          <li key={talk.slug}>
            <span className="date">{talk.date}</span>
            <span className="title"><a href={`/slides/${talk.slug}/`}>{talk.title}</a></span>
          </li>
        ))}
      </ul>
    </Layout>
  )
}
