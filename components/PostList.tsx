import { Layout } from './Layout'
import { PostTags } from './PostTags'
import type { Post } from '../blog/content'

interface PostListProps {
  posts: Post[]
  heading?: string
}

export function PostList(props: PostListProps) {
  return (
    <Layout className="blog-list">
      <h1>{props.heading ?? 'Blog'}</h1>
      <ul>
        {props.posts.map((post) => (
          <li key={post.slug}>
            <span className="date">{post.date}</span>
            <span className="title">
              <a href={`/blog/${post.slug}`}>{post.title}</a>
              {post.tags.length > 0 && (
                <span className="ml-2"><PostTags tags={post.tags} /></span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </Layout>
  )
}
