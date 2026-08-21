import { Hono } from 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'
import { css, Style } from 'hono/css'
import { BfScripts } from '@barefootjs/hono/scripts'
import { BlogLayout } from '@/components/BlogLayout'
import { PostList } from '@/components/PostList'
import { PostArticle } from '@/components/PostArticle'
import { posts, getPost } from './content'
import { Assets } from '../dist/bf-assets'

declare module 'hono' {
  interface ContextRenderer {
    (
      content: unknown,
      props?: { title?: string; description?: string; canonical?: string },
    ): Response
  }
}

const BASE = '/blog'

const HeaderClass = css`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 20px 0;

  & a {
    font-family: Inter, sans-serif;
    font-weight: 900;
    text-decoration: underline;
    text-decoration-style: dotted;
    text-underline-offset: 0.2em;
    text-decoration-color: var(--color-text-sub);

    &:hover {
      text-decoration-color: var(--color-text-main);
    }
  }
`

const blogRenderer = jsxRenderer(({ children, title, description, canonical }) => (
  <html lang="ja">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title ?? 'kobaken blog'}</title>
      <meta name="description" content={description ?? ''} />
      <link rel="canonical" href={`https://kobaken.co${canonical ?? BASE}`} />
      <link rel="icon" type="image/jpg" href="/static/img/favicon.ico" />
      <link href="/static/reset.css" rel="stylesheet" />
      <link href="/static/style.css" rel="stylesheet" />
      <Style />
    </head>
    <body>
      <header className={HeaderClass}><a href="/">← kobaken.co</a></header>
      <BlogLayout>{children}</BlogLayout>
      <BfScripts />
      <script type="module" src={Assets.RouterEntry} />
    </body>
  </html>
))

export const blog = new Hono()
blog.use(blogRenderer)

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
