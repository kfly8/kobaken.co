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
      // A day fresh, up to a week stale-while-revalidate — short enough
      // that a title fix shows up without needing a manual cache purge,
      // long enough that repeat crawler fetches rarely hit a cache miss.
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  })
}
