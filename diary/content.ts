import { RAW_POSTS } from '../dist/diary-posts'
import { createPostCollection } from '../content/posts'

// RAW_POSTS is generated from content/diary/*.md by
// scripts/generate-posts.mjs — add a post by dropping a file there with
// `published: true` in its frontmatter, not by editing this file.
export const { posts, getPost, getPostsByTag } = createPostCollection(RAW_POSTS, 'diary')
