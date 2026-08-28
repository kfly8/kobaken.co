import helloDiary from '../content/diary/hello-diary.md'
import { createPostCollection } from '../content/posts'

// New posts are added here by hand — one `import`, one entry.
const RAW_POSTS: Record<string, string> = {
  'hello-diary': helloDiary,
}

export const { posts, getPost, getPostsByTag } = createPostCollection(RAW_POSTS)
