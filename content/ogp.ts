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

export async function renderOgpImage(
  post: Post,
  section: 'Blog' | 'Diary',
  ifNoneMatch: string | undefined,
  ctx: ExecutionContext,
): Promise<Response> {
  const etag = `"${post.contentHash}"`
  // Cheap check (a string compare against an already-computed hash) before
  // the expensive part (satori layout + resvg rasterization). Whether the
  // platform's stale-while-revalidate actually forwards If-None-Match to
  // reach this branch is unconfirmed (undocumented, and local wrangler dev
  // doesn't implement Workers Cache purge/revalidation yet either) — this
  // is correct either way, just not proven to be the common case yet.
  if (ifNoneMatch === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } })
  }

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
      // A week fresh, up to 30 days serving stale while revalidating in
      // the background — long enough that repeat crawler fetches rarely
      // cost a full render, bounded enough that an edit shows up on its
      // own. ETag (post.contentHash, the whole raw post — not just the
      // title) is what actually decides whether a revalidation needs to
      // re-render or can shortcut to 304 above.
      'Cache-Control': 'public, max-age=604800, stale-while-revalidate=2592000',
      ETag: etag,
    },
  })
}
