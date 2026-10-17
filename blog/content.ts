import { RAW_POSTS } from '../dist/blog-posts'
import { createPostCollection } from '../content/posts'

export type { Post } from '../content/posts'

// RAW_POSTS is generated from content/blog/*.md by
// scripts/generate-posts.mjs — add a post by dropping a file there with
// `published: true` in its frontmatter, not by editing this file.
// <slug>.en.md and <slug>.ja.md are one post in two languages.
export const collection = createPostCollection(RAW_POSTS, 'blog')
export const { posts } = collection
