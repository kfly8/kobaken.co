import { SLIDES } from '../dist/slides'
import { Layout } from './Layout'
import { type Lang, languageMenu } from '../i18n'

export function SlidesIndex(props: { lang: Lang }) {
  const menu = languageMenu('/slides', props.lang)
  return (
    <Layout className="slides-list" active="slides" lang={props.lang} menu={menu}>
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
