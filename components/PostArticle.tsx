import { Layout } from './Layout'
import { PostTags } from './PostTags'
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
        {props.post.tags.length > 0 && (
          <p className="mt-10"><PostTags tags={props.post.tags} /></p>
        )}
      </article>
      <p className="back"><a href="/blog">← Back to Blog</a></p>
    </Layout>
  )
}
