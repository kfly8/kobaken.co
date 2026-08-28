import { Layout } from './Layout'
import { PostTags } from './PostTags'
import type { Post } from '../content/posts'

interface PostArticleProps {
  post: Post
  related?: Post[]
  basePath: string
  backLabel: string
}

export function PostArticle(props: PostArticleProps) {
  const related = props.related ?? []
  return (
    <Layout className="blog-article">
      <article>
        <h1>{props.post.title}</h1>
        <p className="date">
          {props.post.date}
          {/* data-bf-router="false": the client router must not intercept
              this — it would try to morph the Markdown response as HTML. */}
          {/* Children must stay on one line: the compiled template keeps the
              surrounding whitespace, and the underline would cover it. */}
          <a
            href={`${props.basePath}/${props.post.slug}.md`}
            data-bf-router="false"
            className="ml-3 underline decoration-dotted underline-offset-[0.2em] decoration-[var(--color-text-sub)] hover:text-color-[var(--color-text-main)] hover:decoration-[var(--color-text-main)]"
          >Markdown</a>
        </p>
        <div className="body" dangerouslySetInnerHTML={{ __html: props.post.html }} />
        {props.post.tags.length > 0 && (
          <p className="mt-10"><PostTags tags={props.post.tags} basePath={props.basePath} /></p>
        )}
      </article>
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="font-bold mb-3">関連記事</h2>
          <ul>
            {related.map((r) => (
              <li key={r.slug} className="my-2">
                <a
                  href={`${props.basePath}/${r.slug}`}
                  className="underline decoration-dotted underline-offset-[0.2em] decoration-[var(--color-text-sub)] tracking-[0.03em] hover:decoration-[var(--color-text-main)]"
                >{r.title}</a>
              </li>
            ))}
          </ul>
        </section>
      )}
      <p className="back"><a href={props.basePath}>← Back to {props.backLabel}</a></p>
    </Layout>
  )
}
