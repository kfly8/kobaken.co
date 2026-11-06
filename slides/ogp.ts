import { SLIDES } from '../dist/slides'
import type { SlideDeck } from './types'
import { screenshotSlide } from './screenshot'

const SITE_URL = 'https://kobaken.co'
const IMAGE_CACHE = 'public, max-age=604800, stale-while-revalidate=2592000'
const PAGE_CACHE = 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600'

function selectedSlide(slug: string, url: URL) {
  const deck = SLIDES.find((deck) => deck.slug === slug)
  let segment: string
  try {
    segment = decodeURIComponent(url.pathname.split('/')[3] ?? '')
  } catch {
    return undefined
  }
  const raw = /^\d+$/.test(segment) ? segment : url.searchParams.get('slide') ?? '1'
  if (!/^\d+$/.test(raw)) return undefined
  const number = Number(raw)
  if (!Number.isSafeInteger(number) || number < 1) return undefined
  const slide = deck?.slides[number - 1]
  return deck && slide ? { deck, slide } : undefined
}

function notFound() {
  return new Response('Not Found', { status: 404, headers: { 'Cache-Control': 'no-store' } })
}

function matchesEtag(header: string | null, etag: string) {
  return header?.split(',').some((value) => value.trim() === '*' || value.trim().replace(/^W\//, '') === etag.replace(/^W\//, '')) ?? false
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char)
}

function metadata(deck: SlideDeck, slide: SlideDeck['slides'][number]) {
  const url = `${SITE_URL}/slides/${deck.slug}/${slide.number}`
  const image = `${url}/og-${slide.version}.png`
  const meta = (attribute: 'name' | 'property', key: string, value: string | number) =>
    `<meta ${attribute}="${key}" content="${escapeHtml(String(value))}">`
  return [
    `<title>${escapeHtml(slide.title)} — kobaken</title>`,
    `<link rel="canonical" href="${escapeHtml(url)}">`,
    meta('name', 'description', slide.description),
    meta('property', 'og:title', slide.title),
    meta('property', 'og:description', slide.description),
    meta('property', 'og:site_name', 'kobaken.co'),
    meta('property', 'og:locale', 'ja_JP'),
    meta('property', 'og:url', url),
    meta('property', 'og:image', image),
    meta('property', 'og:image:width', deck.width),
    meta('property', 'og:image:height', deck.height),
    meta('property', 'og:type', 'website'),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', slide.title),
    meta('name', 'twitter:description', slide.description),
    meta('name', 'twitter:image', image),
    meta('name', 'twitter:site', '@kfly8'),
    meta('name', 'twitter:creator', '@kfly8'),
  ].join('\n')
}

export async function renderSlidePage({ slug, request, assets }: {
  slug: string
  request: Request
  assets: Fetcher
}): Promise<Response> {
  const url = new URL(request.url)
  const selected = selectedSlide(slug, url)
  if (!selected) return notFound()
  const canonicalPath = `/slides/${slug}/${selected.slide.number}`
  if (url.searchParams.has('slide') || (url.pathname !== canonicalPath && url.pathname !== `/slides/${slug}/`)) {
    url.pathname = `/slides/${slug}/${selected.slide.number}`
    url.searchParams.delete('slide')
    return new Response(null, { status: 308, headers: { Location: url.href, 'Cache-Control': PAGE_CACHE } })
  }
  const source = await assets.fetch(new URL(`/slides/${slug}/`, url))
  if (!source.ok) return notFound()
  const headers = new Headers(source.headers)
  for (const name of ['ETag', 'Content-Length', 'Content-Encoding', 'Last-Modified', 'CF-Cache-Status']) headers.delete(name)
  headers.set('Cache-Control', PAGE_CACHE)
  const response = new Response(source.body, { headers })
  return new HTMLRewriter()
    .on('title, link[rel="canonical"], meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]', {
      element(element) { element.remove() },
    })
    .on('head', {
      element(element) {
        element.append(metadata(selected.deck, selected.slide), { html: true })
      },
    })
    .transform(response)
}

export async function renderSlideOgpImage({ slug, request, env, version = null }: {
  slug: string
  request: Request
  env: CloudflareBindings
  version?: string | null
}): Promise<Response> {
  const url = new URL(request.url)
  const selected = selectedSlide(slug, url)
  if (!selected) return notFound()
  const { deck, slide } = selected
  if (version !== null && version !== slide.version) {
    return new Response(null, { status: 302, headers: { Location: `/slides/${slug}/${slide.number}/og-${slide.version}.png`, 'Cache-Control': 'no-store' } })
  }
  const headers = {
    'Content-Type': 'image/png',
    'Cache-Control': IMAGE_CACHE,
    ETag: `W/"${slide.version}"`,
  }
  if (matchesEtag(request.headers.get('If-None-Match'), headers.ETag)) {
    return new Response(null, { status: 304, headers })
  }
  if (request.method === 'HEAD') return new Response(null, { headers })
  try {
    const png = await screenshotSlide({ deck, slide, env })
    return new Response(png, { headers })
  } catch (error) {
    console.error(JSON.stringify({ event: 'slide_ogp_failed', slug, slide: slide.number, error: String(error) }))
    return new Response('Slide image temporarily unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }
}
