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
        <p className="date">
          {props.post.date}
          {/* data-bf-router="false": the client router must not intercept
              this — it would try to morph the Markdown response as HTML.
              Children must stay on one line: the compiled template keeps
              the surrounding whitespace, and the underline would cover it. */}
          <a
            href={`/blog/${props.post.slug}.md`}
            data-bf-router="false"
            className="ml-3 underline decoration-dotted underline-offset-[0.2em] decoration-[var(--color-text-sub)] hover:text-color-[var(--color-text-main)] hover:decoration-[var(--color-text-main)]"
          >Markdown</a>
        </p>
        <div className="body" dangerouslySetInnerHTML={{ __html: props.post.html }} />
        {props.post.tags.length > 0 && (
          <p className="mt-10"><PostTags tags={props.post.tags} /></p>
        )}
      </article>
      <p className="back"><a href="/blog">← Back to Blog</a></p>
    </Layout>
  )
}
