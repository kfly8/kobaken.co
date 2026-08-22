import { Hono } from 'hono'
import { PostList } from '@/components/PostList'
import { PostArticle } from '@/components/PostArticle'
import { posts, getPost, getPostsByTag } from './content'

const BASE = '/blog'

export const blog = new Hono()

blog.get('/', (c) =>
  c.render(<PostList posts={posts} />, {
    title: 'kobaken blog',
    description: '技術ブログ記事一覧',
    canonical: BASE,
  }),
)

blog.get('/tags/:tag', (c) => {
  const tag = c.req.param('tag')
  const tagged = getPostsByTag(tag)
  // Unknown tags 404 like unknown slugs do — tags only exist through posts,
  // so an empty list can't be a legitimate page.
  if (tagged.length === 0) return c.notFound()
  return c.render(<PostList posts={tagged} heading={`#${tag}`} />, {
    title: `#${tag} — kobaken blog`,
    description: `タグ「${tag}」の記事一覧`,
    canonical: `${BASE}/tags/${encodeURIComponent(tag)}`,
  })
})

blog.get('/:slug', (c) => {
  const post = getPost(c.req.param('slug'))
  if (!post) return c.notFound()
  return c.render(<PostArticle post={post} />, {
    title: `${post.title} — kobaken blog`,
    description: post.description,
    canonical: `${BASE}/${post.slug}`,
  })
})
