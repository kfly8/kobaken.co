import { Hono } from 'hono'
import { PostList } from '@/components/PostList'
import { PostArticle } from '@/components/PostArticle'
import { posts, getPost } from './content'

const BASE = '/blog'

export const blog = new Hono()

blog.get('/', (c) =>
  c.render(<PostList posts={posts} />, {
    title: 'kobaken blog',
    description: '技術ブログ記事一覧',
    canonical: BASE,
  }),
)

blog.get('/:slug', (c) => {
  const post = getPost(c.req.param('slug'))
  if (!post) return c.notFound()
  return c.render(<PostArticle post={post} />, {
    title: `${post.title} — kobaken blog`,
    description: post.description,
    canonical: `${BASE}/${post.slug}`,
  })
})
