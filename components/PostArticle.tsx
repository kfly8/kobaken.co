import { Layout } from './Layout'
import type { Post } from '../blog/content'

interface PostArticleProps {
  post: Post
}

export function PostArticle(props: PostArticleProps) {
  return (
    <Layout className="blog-article">
      <article>
        <h1>{props.post.title}</h1>
        <p className="date">{props.post.date}</p>
        <div className="body" dangerouslySetInnerHTML={{ __html: props.post.html }} />
      </article>
      <p className="back"><a href="/blog">← Back to Blog</a></p>
    </Layout>
  )
}
