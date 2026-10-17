import { SLIDES } from '../dist/slides'
import { Layout } from './Layout'
import { type Lang, switchLink } from '../i18n'

export function SlidesIndex(props: { lang: Lang }) {
  const switchTo = switchLink('/slides', props.lang)
  return (
    <Layout className="slides-list" active="slides" lang={props.lang} switchHref={switchTo.href} switchLabel={switchTo.label} switchLang={switchTo.lang}>
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
