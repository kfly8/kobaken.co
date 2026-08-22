import { marked } from 'marked'
import helloBlog from '../content/blog/hello-blog.md'

// New posts are added here by hand — one `import`, one entry.
const RAW_POSTS: Record<string, string> = {
  'hello-blog': helloBlog,
}

interface FrontMatter {
  title: string
  date: string
  description?: string
  tags?: string[]
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
    data[key] = key === 'tags' ? JSON.parse(rawValue) : rawValue.replace(/^"|"$/g, '')
  }
  return { data: data as unknown as FrontMatter, body }
}

export interface Post {
  slug: string
  title: string
  date: string
  description?: string
  tags: string[]
  html: string
}

export const posts: Post[] = Object.entries(RAW_POSTS)
  .map(([slug, raw]) => {
    const { data, body } = parseFrontMatter(raw)
    return {
      slug,
      title: data.title,
      date: data.date,
      description: data.description,
      tags: data.tags ?? [],
      html: marked.parse(body) as string,
    }
  })
  .sort((a, b) => b.date.localeCompare(a.date))

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getPostsByTag(tag: string): Post[] {
  return posts.filter((p) => p.tags.includes(tag))
}
