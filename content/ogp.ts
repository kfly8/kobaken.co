import { GoogleFont, ImageResponse, cache } from '@cf-wasm/og/workerd'
import type { ExecutionContext } from 'hono'
import { AVATAR_DATA_URI } from './avatar'
import type { Post } from './posts'

const WIDTH = 1200
const HEIGHT = 630
const PAPER = '#f8fbf8'
const INK = '#2b2b2b'
const INK_SUB = '#595857'

// Node shape satori accepts directly, with no JSX/React involved — the
// rest of this codebase compiles JSX through BarefootJS's own runtime
// (see tsconfig's jsxImportSource), so mixing in a second JSX runtime
// just for this one file isn't worth it for a handful of static nodes.
const node = (type: string, style: Record<string, unknown>, children?: unknown, extra?: Record<string, unknown>) => ({
  type,
  props: { style, children, ...extra },
})

// Longer titles need a smaller size to keep wrapping readable within the
// fixed 630px-tall card — thresholds picked by eye against real post
// titles (see the "kobaken.co Share Cards" design mockup).
function titleFontSize(title: string): number {
  if (title.length <= 20) return 96
  if (title.length <= 36) return 67
  return 52
}

// FNV-1a over the title, used as a cache-busting query param on the OGP
// image URL (?v=<hash>) — the same content-addressed pattern this project
// already uses for static assets (dist/asset-version.ts's ?v=<hash>).
// A title edit produces a new URL, so the (immutable, cached-for-a-year)
// response below never needs to be purged or revalidated.
export function ogVersion(title: string): string {
  let hash = 0x811c9dc5
  for (let i = 0; i < title.length; i++) {
    hash ^= title.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}

export async function renderOgpImage(post: Post, section: 'Blog' | 'Diary', ctx: ExecutionContext): Promise<Response> {
  cache.setExecutionContext(ctx)

  const tree = node('div', {
    width: WIDTH,
    height: HEIGHT,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 72,
    background: PAPER,
    fontFamily: 'Inter',
  }, [
    node('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, [
      node('div', { display: 'flex', alignItems: 'center', gap: 20 }, [
        node('img', { width: 60, height: 60, borderRadius: '50%' }, undefined, { src: AVATAR_DATA_URI }),
        node('span', { fontWeight: 900, fontSize: 28, color: INK_SUB, letterSpacing: '-0.01em' }, 'kobaken.co'),
      ]),
      node('span', { fontWeight: 600, fontSize: 16, letterSpacing: '0.12em', textTransform: 'uppercase', color: INK_SUB }, section),
    ]),
    node('div', { display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }, [
      node('div', {
        display: 'flex',
        fontWeight: 900,
        fontSize: titleFontSize(post.title),
        lineHeight: 1.12,
        letterSpacing: '-0.015em',
        color: INK,
        textWrap: 'balance',
        maxWidth: '96%',
      }, post.title, { lang: 'ja-JP' }),
    ]),
  ])

  return ImageResponse.async(tree, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      new GoogleFont('Inter', { weight: 900, subset: 'latin' }),
      new GoogleFont('Noto Sans JP', { weight: 900, subset: 'japanese' }),
    ],
    headers: {
      // Safe to cache forever: the URL (?v=ogVersion(title)) changes
      // whenever the title does, so a stale cache entry is never served
      // under the URL a fresh page actually links to.
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
