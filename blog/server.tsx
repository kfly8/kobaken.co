import { Hono } from 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'
import { BfScripts } from '@barefootjs/hono/scripts'
import { Header } from '@/components/Header'
import { BlogLayout } from '@/components/BlogLayout'
import { PostList } from '@/components/PostList'
import { PostArticle } from '@/components/PostArticle'
import { posts, getPost } from './content'
import { Assets } from '../dist/bf-assets'
import { themeInitScript } from '../theme-script'

declare module 'hono' {
  interface ContextRenderer {
    (
      content: unknown,
      props?: {
        title?: string,
        description?: string,
        canonical?: string,
        isHome?: boolean,
      },
    ): Response
  }
}

const BASE = '/blog'

const blogRenderer = jsxRenderer(({ children, title, description, canonical }) => (
  <html lang="ja">
    <head>
      <meta charset="utf-8" />
      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title ?? 'kobaken blog'}</title>
      <meta name="description" content={description ?? ''} />
      <link rel="canonical" href={`https://kobaken.co${canonical ?? BASE}`} />
      <link rel="icon" type="image/jpg" href="/static/img/favicon.ico" />
      <link href="/static/reset.css" rel="stylesheet" />
      <link href="/static/fontello-embedded.css" rel="stylesheet" />
      <link href="/static/style.css" rel="stylesheet" />
      <link href="/static/header.css" rel="stylesheet" />
      <link href="/static/blog.css" rel="stylesheet" />
      <script src="/static/script.js" defer />
    </head>
    <body>
      <Header />
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
