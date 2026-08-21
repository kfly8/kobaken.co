import { css } from 'hono/css'
import type { Post } from '../blog/content'

interface PostListProps {
  posts: Post[]
}

export function PostList(props: PostListProps) {
  const PageClass = css`
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;

    & h1 {
      font-family: Inter, sans-serif;
      font-weight: 900;
      font-size: xx-large;
      margin-bottom: 20px;
    }

    & li {
      display: flex;
      align-items: baseline;
      margin: 20px 0;
    }

    & .date {
      white-space: nowrap;
      font-weight: 300;
      font-family: monospace;
      margin-right: 13px;
      width: 90px;
      text-align: right;
    }

    & .title a {
      text-decoration: underline;
      text-decoration-style: dotted;
      text-underline-offset: 0.2em;
      text-decoration-color: var(--color-text-sub);
      letter-spacing: 0.03em;

      &:hover {
        text-decoration-color: var(--color-text-main);
      }
    }
  `

  return (
    <main className={PageClass}>
      <h1>Blog</h1>
      <ul>
        {props.posts.map((post) => (
          <li key={post.slug}>
            <span className="date">{post.date}</span>
            <span className="title"><a href={`/blog/${post.slug}`}>{post.title}</a></span>
          </li>
        ))}
      </ul>
    </main>
  )
}
