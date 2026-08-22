// Builds the Open Knowledge Format (OKF) v0.2 frontmatter served at
// /blog/<slug>.md — the same shape notes.kobaken.co uses for /<slug>.md.
// Spec: https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md
//
// Only the fields a consumer needs to grasp the article at a glance: the
// required `type`, plus `title` / `description` / `tags`. Tracking fields
// like dates are deliberately left out, matching the notes site.

import type { Post } from './content'

const UNSAFE_START = /^[-?:,[\]{}#&*!|>'"%@`\s]/

// Emit a YAML scalar: plain when unambiguous, JSON-quoted otherwise
// (YAML is a superset of JSON).
const yamlScalar = (value: string): string => {
  const plain =
    value.length > 0 &&
    !UNSAFE_START.test(value) &&
    !/: /.test(value) &&
    !/ #/.test(value) &&
    !/[\n\r]/.test(value) &&
    !/\s$/.test(value)
  return plain ? value : JSON.stringify(value)
}

export const okfFrontmatter = (post: Post): string => {
  const lines = ['type: Article', `title: ${yamlScalar(post.title)}`]

  if (post.description) lines.push(`description: ${yamlScalar(post.description)}`)
  if (post.tags.length > 0) {
    lines.push(`tags: [${post.tags.map(yamlScalar).join(', ')}]`)
  }

  return `---\n${lines.join('\n')}\n---\n`
}
