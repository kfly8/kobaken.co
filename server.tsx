import { Hono } from 'hono'
import type { Context } from 'hono'
import { cors } from 'hono/cors'
import { setCookie } from 'hono/cookie'
import { languageDetector } from 'hono/language'
import { renderer } from './renderer'
import { blog } from './blog/server'
import { diary } from './diary/server'
import { collection as blogPosts } from './blog/content'
import { collection as diaryPosts } from './diary/content'
import { renderSitemap } from './content/sitemap'
import { COOKIE, DEFAULT_LANG, LANGS, type Lang, isLang, localized, messages, otherLang } from './i18n'

import { Root } from '@/components/Root'
import { ProfilePage } from '@/components/ProfilePage'
import { SlidesIndex } from '@/components/SlidesIndex'

const app = new Hono()

app.use('/api/*', cors())

app.get('/sitemap.xml', (c) =>
  c.body(renderSitemap(blogPosts, diaryPosts), 200, { 'Content-Type': 'application/xml; charset=utf-8' }),
)

app.use('*', renderer)

// Each page in each language, at /en/... and /ja/...
for (const lang of LANGS) {
  const t = messages[lang]
  const both = [lang, otherLang(lang)]
  const site = new Hono()

  site.get('/', (c) =>
    c.render(<Root lang={lang} />, { lang, title: 'kobaken', description: t.homeDescription, path: '/', alternates: both }),
  )
  site.get('/profile', (c) =>
    c.render(<ProfilePage lang={lang} />, {
      lang,
      title: 'Profile | kobaken',
      description: t.profileDescription,
      path: '/profile',
      alternates: both,
    }),
  )
  site.get('/slides', (c) =>
    c.render(<SlidesIndex lang={lang} />, {
      lang,
      title: 'Slides | kobaken',
      description: t.slidesDescription,
      path: '/slides',
      alternates: both,
    }),
  )
  site.route('/blog', blog(lang))
  site.route('/diary', diary(lang))

  app.route(`/${lang}`, site)
}

// The paths without a language are entry points. They lead each reader to
// the page in the language they asked for (?lang=, which is how the
// language switch asks and is then kept in a cookie), chose before
// (cookie) or read (Accept-Language), and to English otherwise. They never
// show a page themselves, so a fixed-language URL is the only thing a
// search engine indexes or a reader shares, and a language-fixed page
// never sends anyone elsewhere.
app.use(
  '*',
  languageDetector({
    supportedLanguages: [...LANGS],
    fallbackLanguage: DEFAULT_LANG,
    order: ['querystring', 'cookie', 'header'],
    lookupQueryString: 'lang',
    lookupCookie: COOKIE,
    // The cookie is set only when a reader picks a language (below), not
    // from what a browser happens to send.
    caches: false,
  }),
)

// The languages a page without a language exists in, or none when there is
// no such page: a post may be in one language only.
function langsAt(path: string): Lang[] {
  if (path === '/' || path === '/profile' || path === '/slides') return LANGS
  const section = path.match(/^\/(blog|diary)(\/.*)?$/)
  if (!section) return []
  const posts = section[1] === 'blog' ? blogPosts : diaryPosts
  const rest = section[2] ?? ''
  if (rest === '' || /^\/tags\/[^/]+$/.test(rest)) return LANGS
  const slug = rest.match(/^\/([a-z0-9-]+)(?:\.md|\/og\.png)?$/)?.[1]
  return slug ? posts.langsOf(slug) : []
}

const negotiate = (c: Context) => {
  const path = c.req.path.length > 1 ? c.req.path.replace(/\/$/, '') : '/'
  if (/^\/(en|ja)(\/|$)/.test(path)) return c.notFound()
  const langs = langsAt(path)
  if (langs.length === 0) return c.notFound()

  const picked = c.req.query('lang')
  if (isLang(picked)) {
    setCookie(c, COOKIE, picked, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'Lax', secure: true })
  }
  const wanted = c.get('language')
  const lang = isLang(wanted) && langs.includes(wanted) ? wanted : langs.includes(DEFAULT_LANG) ? DEFAULT_LANG : langs[0]

  // Where this leads depends on the reader, so no cache may keep it.
  c.header('Cache-Control', 'private, no-store')
  c.header('Vary', 'Accept-Language, Cookie')
  return c.redirect(localized(path, lang), 302)
}

app.get('*', negotiate)

export default app
