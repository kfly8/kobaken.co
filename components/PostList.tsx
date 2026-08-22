import { Layout } from './Layout'
import type { Post } from '../blog/content'

interface PostListProps {
  posts: Post[]
}

export function PostList(props: PostListProps) {
  return (
    <Layout className="blog-list">
      <h1>Blog</h1>
      <ul>
        {props.posts.map((post) => (
          <li key={post.slug}>
            <span className="date">{post.date}</span>
            <span className="title"><a href={`/blog/${post.slug}`}>{post.title}</a></span>
          </li>
        ))}
      </ul>
    </Layout>
  )
}
