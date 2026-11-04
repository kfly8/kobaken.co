import { SLIDES } from '../dist/slides'

// Same freshness as the blog's and diary's cards (content/ogp.ts): a week
// fresh, then up to 30 days stale while Cloudflare revalidates in the
// background.
const CACHE_CONTROL = 'public, max-age=604800, stale-while-revalidate=2592000'

// /slides/<slug>/og.png: the talk's slide 1, rendered at build time to
// public/slides/<slug>/og-cover-<hash>.png (scripts/slide-cover.mjs).
//
// Served through the Worker rather than straight from Workers Assets so it
// carries the same Cache-Control as the other share cards, and Workers
// Cache keeps it — Workers Assets would answer with max-age=0. The hash in
// the file name is a hash of slide 1, so it doubles as the ETag: a
// revalidation for an unchanged slide is answered without reading the file.
export async function renderSlideOgpImage(
  slug: string,
  ifNoneMatch: string | undefined,
  assets: Fetcher,
  requestUrl: string,
): Promise<Response> {
  const talk = SLIDES.find((t) => t.slug === slug)
  const cover = talk?.cover
  if (!cover) return new Response('Not Found', { status: 404 })

  const etag = `"${cover.replace(/^og-cover-|\.png$/g, '')}"`
  if (ifNoneMatch === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } })
  }

  const file = await assets.fetch(new URL(`/slides/${slug}/${cover}`, requestUrl))
  if (!file.ok) return new Response('Not Found', { status: 404 })
  return new Response(file.body, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': CACHE_CONTROL,
      ETag: etag,
    },
  })
}
