import type { PostCollection } from './posts'
import { LANGS, type Lang, localized } from '../i18n'

const SITE_URL = 'https://kobaken.co'

// A page, by its path without a language, and the languages it is in. Each
// language's URL is listed, naming the others (hreflang) when there are
// more than one. The paths without a language only lead to these, so they
// are not listed.
type Page = { path: string; langs: Lang[]; lastmod?: string }

function sectionPages(base: string, posts: PostCollection): Page[] {
  const latest = posts.posts[0]?.date
  const tags = [...new Set(posts.posts.flatMap((post) => post.tags))]
  const slugs = [...new Set(posts.posts.map((post) => post.slug))]
  return [
    { path: base, langs: LANGS, lastmod: latest },
    ...tags.map((tag) => ({ path: `${base}/tags/${encodeURIComponent(tag)}`, langs: LANGS, lastmod: latest })),
    ...slugs.map((slug) => ({
      path: `${base}/${slug}`,
      langs: posts.langsOf(slug),
      lastmod: posts.posts.find((post) => post.slug === slug)?.date,
    })),
  ]
}

function urlEntries(page: Page): string[] {
  const alternates =
    page.langs.length > 1
      ? [
          ...page.langs.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}${localized(page.path, l)}"/>`),
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${page.path}"/>`,
        ]
      : []
  return page.langs.map(
    (lang) => `  <url>
    <loc>${SITE_URL}${localized(page.path, lang)}</loc>
${page.lastmod ? `    <lastmod>${page.lastmod}</lastmod>\n` : ''}${alternates.map((a) => `${a}\n`).join('')}  </url>`,
  )
}

export function renderSitemap(blogPosts: PostCollection, diaryPosts: PostCollection): string {
  const pages: Page[] = [
    { path: '/', langs: LANGS },
    { path: '/profile', langs: LANGS },
    { path: '/slides', langs: LANGS },
    ...sectionPages('/blog', blogPosts),
    ...sectionPages('/diary', diaryPosts),
  ]

  return `<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.flatMap(urlEntries).join('\n')}
</urlset>
`
}
