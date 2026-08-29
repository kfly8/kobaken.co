import { Hono } from 'hono'
import { PostList } from '@/components/PostList'
import { PostArticle } from '@/components/PostArticle'
import { posts, getPost, getPostsByTag } from './content'
import { okfFrontmatter } from '../content/okf'
import { renderOgpImage } from '../content/ogp'

const BASE = '/diary'

export const diary = new Hono()

diary.get('/', (c) =>
  c.render(<PostList posts={posts} basePath={BASE} heading="Diary" />, {
    title: 'kobaken diary',
    description: '日記',
    canonical: BASE,
  }),
)

diary.get('/tags/:tag', (c) => {
  const tag = c.req.param('tag')
  const tagged = getPostsByTag(tag)
  // Unknown tags 404 like unknown slugs do — tags only exist through posts,
  // so an empty list can't be a legitimate page.
  if (tagged.length === 0) return c.notFound()
  return c.render(<PostList posts={tagged} basePath={BASE} heading={`#${tag}`} />, {
    title: `#${tag} — kobaken diary`,
    description: `タグ「${tag}」の記事一覧`,
    canonical: `${BASE}/tags/${encodeURIComponent(tag)}`,
  })
})

diary.get('/:slug/og.png', (c) => {
  const post = getPost(c.req.param('slug'))
  if (!post) return c.notFound()
  return renderOgpImage(post, 'Diary', c.req.header('If-None-Match'), c.executionCtx)
})

// Must be registered before /:slug — its default [^/]+ pattern also matches
// "hello-diary.md", and the router keeps whichever route was added first.
diary.get('/:slug{[a-z0-9-]+\\.md}', (c) => {
  // The param includes the extension the pattern matched.
  const slug = c.req.param('slug').replace(/\.md$/, '')
  const post = getPost(slug)
  if (!post) return c.notFound()
  return c.body(`${okfFrontmatter(post)}${post.body}\n`, 200, {
    'Content-Type': 'text/markdown; charset=utf-8',
  })
})

diary.get('/:slug', (c) => {
  const post = getPost(c.req.param('slug'))
  if (!post) return c.notFound()
  const related = post.related.map(getPost).filter((p): p is NonNullable<typeof p> => p !== undefined)
  return c.render(<PostArticle post={post} related={related} basePath={BASE} backLabel="Diary" />, {
    title: `${post.title} — kobaken diary`,
    description: post.description,
    canonical: `${BASE}/${post.slug}`,
    image: `${BASE}/${post.slug}/og.png`,
  })
})
