import { marked } from 'marked'

interface FrontMatter {
  title: string
  date: string
  description?: string
  tags?: string[]
  // Hand-curated related-post slugs — resolved to posts at render time.
  related?: string[]
}

// FNV-1a over the raw (pre-parse) Markdown, exposed as Post.contentHash —
// a fingerprint of the whole post, not just its title, so it also moves
// when the body/tags/description change (used as an ETag for the OGP
// image at /<section>/<slug>/og.png; see content/ogp.ts).
function fnv1a(input: string): string {
  let hash = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}

function parseFrontMatter(raw: string): { data: FrontMatter; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) throw new Error('frontmatter missing')
  const [, frontmatter, body] = match
  const data: Record<string, unknown> = {}
  for (const line of frontmatter.split('\n').filter(Boolean)) {
    const i = line.indexOf(':')
    const key = line.slice(0, i).trim()
    const rawValue = line.slice(i + 1).trim()
    data[key] = key === 'tags' || key === 'related' ? JSON.parse(rawValue) : rawValue.replace(/^"|"$/g, '')
  }
  return { data: data as unknown as FrontMatter, body }
}

export interface Post {
  slug: string
  title: string
  date: string
  description?: string
  tags: string[]
  related: string[]
  // Raw Markdown body (frontmatter stripped) — served as-is at /<section>/<slug>.md.
  body: string
  html: string
  // Fingerprint of the whole raw post (frontmatter + body) — see fnv1a() above.
  contentHash: string
}

export interface PostCollection {
  posts: Post[]
  getPost: (slug: string) => Post | undefined
  getPostsByTag: (tag: string) => Post[]
}

// Turns a slug → raw-Markdown-with-frontmatter map into a Post collection.
// Shared by /blog and /diary, which differ only in which files they pass in.
export function createPostCollection(rawPosts: Record<string, string>): PostCollection {
  const posts: Post[] = Object.entries(rawPosts)
    .map(([slug, raw]) => {
      const { data, body } = parseFrontMatter(raw)
      const trimmedBody = body.trim()
      return {
        slug,
        title: data.title,
        date: data.date,
        description: data.description,
        tags: data.tags ?? [],
        related: data.related ?? [],
        body: trimmedBody,
        html: marked.parse(trimmedBody) as string,
        contentHash: fnv1a(raw),
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date))

  return {
    posts,
    getPost: (slug) => posts.find((p) => p.slug === slug),
    getPostsByTag: (tag) => posts.filter((p) => p.tags.includes(tag)),
  }
}
