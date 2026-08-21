import { css } from 'hono/css'
import type { Post } from '../blog/content'

interface PostArticleProps {
  post: Post
}

export function PostArticle(props: PostArticleProps) {
  const PageClass = css`
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;

    & h1 {
      font-family: Inter, sans-serif;
      font-weight: 900;
      font-size: xx-large;
    }

    & .date {
      font-weight: 300;
      font-family: monospace;
      color: var(--color-text-sub);
      margin: 8px 0 30px;
    }

    & .body {
      line-height: 1.8;

      & p {
        margin: 1.2em 0;
      }

      & a {
        text-decoration: underline;
        text-decoration-style: dotted;
        text-underline-offset: 0.2em;
        text-decoration-color: var(--color-text-sub);

        &:hover {
          text-decoration-color: var(--color-text-main);
        }
      }

      & code {
        font-family: monospace;
        background: var(--color-text-sub);
        color: var(--color-background);
        padding: 0.1em 0.4em;
        border-radius: 4px;
      }

      & iframe {
        display: block;
        margin: 1.5em 0;
      }
    }

    & .back {
      margin-top: 40px;

      & a {
        text-decoration: underline;
        text-decoration-style: dotted;
        text-underline-offset: 0.2em;
        text-decoration-color: var(--color-text-sub);

        &:hover {
          text-decoration-color: var(--color-text-main);
        }
      }
    }
  `

  return (
    <main className={PageClass}>
      <article>
        <h1>{props.post.title}</h1>
        <p className="date">{props.post.date}</p>
        <div className="body" dangerouslySetInnerHTML={{ __html: props.post.html }} />
      </article>
      <p className="back"><a href="/blog">← Back to Blog</a></p>
    </main>
  )
}
