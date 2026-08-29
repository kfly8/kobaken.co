import { Layout } from './Layout'
import { PostTags } from './PostTags'
import type { Post } from '../content/posts'

interface PostListProps {
  posts: Post[]
  basePath: string
  heading: string
}

export function PostList(props: PostListProps) {
  return (
    <Layout className="blog-list" active={props.basePath === '/diary' ? 'diary' : 'blog'}>
      <h1>{props.heading}</h1>
      <ul>
        {props.posts.map((post) => (
          <li key={post.slug}>
            <span className="date">{post.date}</span>
            <span className="title">
              <a href={`${props.basePath}/${post.slug}`}>{post.title}</a>
              {post.tags.length > 0 && (
                <span className="ml-2"><PostTags tags={post.tags} basePath={props.basePath} /></span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </Layout>
  )
}
