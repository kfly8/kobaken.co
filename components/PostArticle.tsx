import { Layout } from './Layout'
import { PostTags } from './PostTags'
import type { Post } from '../content/posts'

interface PostArticleProps {
  post: Post
  related?: Post[]
  basePath: string
  backLabel: string
}

// Points at the companion tweet's reply composer, not just the tweet itself —
// one click should land the reader in "write a reply", not "read the tweet".
// Pre-filling the body with a thumbs-up means the box isn't blank on arrival —
// an empty reply field asks the reader to compose something, a pre-filled one
// only asks them to edit or send.
function tweetReplyUrl(tweetUrl: string): string {
  const id = tweetUrl.match(/status\/(\d+)/)?.[1]
  if (!id) return tweetUrl
  const params = new URLSearchParams({ in_reply_to: id, text: '👍️' })
  return `https://twitter.com/intent/tweet?${params}`
}

export function PostArticle(props: PostArticleProps) {
  const related = props.related ?? []
  return (
    <Layout className="blog-article" active={props.basePath === '/diary' ? 'diary' : 'blog'}>
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
        {/* div, not p: reset.css zeroes margin-block-start/end on p, which
            beats uno's margin utilities regardless of specificity — they
            live in a lower-priority @layer. */}
        {props.post.tweetUrl && (
          <div className="mt-10">
            <a
              href={tweetReplyUrl(props.post.tweetUrl)}
              className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-[0.2em] decoration-[var(--color-text-sub)] hover:decoration-[var(--color-text-main)]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[0.9em] h-[0.9em]" aria-hidden="true">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              おたよりはコチラ
            </a>
          </div>
        )}
        {props.post.tags.length > 0 && (
          <div className="mt-10"><PostTags tags={props.post.tags} basePath={props.basePath} /></div>
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
