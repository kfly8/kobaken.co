import type { Post } from './posts'

const SITE_URL = 'https://kobaken.co'

type UrlEntry = { loc: string; lastmod?: string }

function distinctTags(posts: Post[]): string[] {
  return [...new Set(posts.flatMap((post) => post.tags))]
}

function sectionUrls(basePath: string, posts: Post[]): UrlEntry[] {
  const latest = posts[0]?.date
  return [
    { loc: `${SITE_URL}${basePath}`, lastmod: latest },
    ...distinctTags(posts).map((tag) => ({
      loc: `${SITE_URL}${basePath}/tags/${encodeURIComponent(tag)}`,
      lastmod: latest,
    })),
    ...posts.map((post) => ({ loc: `${SITE_URL}${basePath}/${post.slug}`, lastmod: post.date })),
  ]
}

export function renderSitemap(blogPosts: Post[], diaryPosts: Post[]): string {
  const urls: UrlEntry[] = [
    { loc: `${SITE_URL}/` },
    { loc: `${SITE_URL}/profile` },
    { loc: `${SITE_URL}/slides` },
    ...sectionUrls('/blog', blogPosts),
    ...sectionUrls('/diary', diaryPosts),
  ]

  const body = urls
    .map(
      (url) => `  <url>
    <loc>${url.loc}</loc>
${url.lastmod ? `    <lastmod>${url.lastmod}</lastmod>\n` : ''}  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`
}
