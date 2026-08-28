import helloBlog from '../content/blog/hello-blog.md'
import { createPostCollection } from '../content/posts'

export type { Post } from '../content/posts'

// New posts are added here by hand — one `import`, one entry.
const RAW_POSTS: Record<string, string> = {
  'hello-blog': helloBlog,
}

export const { posts, getPost, getPostsByTag } = createPostCollection(RAW_POSTS)
