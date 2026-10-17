import { Hono } from 'hono'
import { PostList } from '@/components/PostList'
import { PostArticle } from '@/components/PostArticle'
import type { PostCollection } from './posts'
import { okfFrontmatter } from './okf'
import { renderOgpImage } from './ogp'
import { type Lang, localized, messages, otherLang } from '../i18n'

interface SectionOptions {
  // '/blog' or '/diary': the path without a language.
  base: '/blog' | '/diary'
  label: 'Blog' | 'Diary'
  description: (lang: Lang) => string
}

// Builds the routes of /blog or /diary in one language, mounted at
// /<lang>/blog or /<lang>/diary. The two sections differ only in their
// posts and their names.
export function createSection(collection: PostCollection, options: SectionOptions, lang: Lang) {
  const { base, label } = options
  const t = messages[lang]
  const app = new Hono()

  app.get('/', (c) =>
    c.render(<PostList posts={collection.listIn(lang)} lang={lang} section={base} heading={label} emptyText={t.noPosts} />, {
      lang,
      title: `kobaken ${label.toLowerCase()}`,
      description: options.description(lang),
      path: base,
      alternates: [lang, otherLang(lang)],
    }),
  )

  app.get('/tags/:tag', (c) => {
    const tag = c.req.param('tag')
    const tagged = collection.getPostsByTag(tag, lang)
    // Unknown tags 404 like unknown slugs do — tags only exist through posts,
    // so an empty list can't be a legitimate page.
    if (tagged.length === 0) return c.notFound()
    return c.render(<PostList posts={tagged} lang={lang} section={base} path={`${base}/tags/${encodeURIComponent(tag)}`} heading={`#${tag}`} emptyText={t.noPosts} />, {
      lang,
      title: `#${tag} — kobaken ${label.toLowerCase()}`,
      description: t.tagDescription(tag),
      path: `${base}/tags/${encodeURIComponent(tag)}`,
      alternates: [lang, otherLang(lang)],
    })
  })

  app.get('/:slug/og.png', (c) => {
    const post = collection.getPost(c.req.param('slug'), lang)
    if (!post) return c.notFound()
    return renderOgpImage(post, label, c.req.header('If-None-Match'), c.executionCtx)
  })

  // Must be registered before /:slug — its default [^/]+ pattern also matches
  // "hello-blog.md", and the router keeps whichever route was added first.
  app.get('/:slug{[a-z0-9-]+\\.md}', (c) => {
    // The param includes the extension the pattern matched.
    const slug = c.req.param('slug').replace(/\.md$/, '')
    const post = collection.getPost(slug, lang)
    if (!post) return c.notFound()
    return c.body(`${okfFrontmatter(post)}${post.body}\n`, 200, {
      'Content-Type': 'text/markdown; charset=utf-8',
    })
  })

  app.get('/:slug', (c) => {
    const slug = c.req.param('slug')
    // A post only in the other language is not this language's page: the
    // entry point (/blog/<slug>) leads there instead.
    const post = collection.getPost(slug, lang)
    if (!post) return c.notFound()
    // Related posts in this language where there is a version of it.
    const related = post.related
      .map((r) => collection.getPost(r, lang) ?? collection.getPost(r, otherLang(lang)))
      .filter((p): p is NonNullable<typeof p> => p !== undefined)
    const path = `${base}/${post.slug}`
    return c.render(<PostArticle post={post} related={related} lang={lang} section={base} backLabel={label} translated={collection.langsOf(post.slug).length > 1} />, {
      lang,
      title: `${post.title} — kobaken ${label.toLowerCase()}`,
      description: post.description,
      path,
      alternates: collection.langsOf(post.slug),
      image: `${localized(path, lang)}/og.png`,
      type: 'article',
      publishedTime: post.date,
    })
  })

  return app
}
