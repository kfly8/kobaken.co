// Writes dist/slides.ts: one entry per talks/<slug>/ directory that has
// a built public/slides/<slug>/manifest.json (the peitho build output,
// whose `title` comes from the deck itself). components/SlidesIndex.tsx
// imports SLIDES from here instead of listing talks by hand — add a talk
// by running `peitho build talks/<slug>/deck.md --out public/slides/<slug>`
// and dropping talks/<slug>/talk.json, not by editing that file.
//
// Also patches each built public/slides/<slug>/index.html's <head> with a
// real <title> and OGP/Twitter card tags — peitho's own template just says
// "Peitho Deck" and carries no OGP at all, and that page is served by
// Workers Assets directly (see talks/README.md), not through renderer.tsx,
// so nothing else sets these. `peitho build` overwrites index.html from
// scratch every time, wiping any hand edit — this patch has to be redone
// on every build for the same reason, not just once.
//
// A talks/<slug>/ without a built manifest.json yet is silently skipped —
// building is what "publishes" a talk. But once it's built, a missing or
// unparsable talk.json fails the build loudly instead of quietly dropping
// the talk from the list — talk.json is easy to forget since peitho's own
// `deck.md` frontmatter has a fixed key set and can't carry a `date`.
//
// The share card shows slide 1: its title and body text (from the
// manifest) and an image of it, /slides/<slug>/og.png. That URL is served
// by the Worker (slides/ogp.ts), not Workers Assets, so it gets the same
// Cloudflare Cache headers as the blog's and diary's cards — the PNG it
// serves is og-cover-<hash>.png next to the built deck, rendered here when
// slide 1 changes (see scripts/slide-cover.mjs).
//
// Runs before `vite build` in the dev/build/deploy scripts.

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { canRender, coverFile, coverHash, existingCovers, renderCover } from './slide-cover.mjs'

const SITE_URL = 'https://kobaken.co'
// Same default share card renderer.tsx falls back to for pages with no
// page-specific OGP image — kept in sync so every "no dedicated image"
// page on the site shares one 1200x630 default instead of the old
// 400x400 profile photo.
const FALLBACK_IMAGE = `${SITE_URL}/static/img/og-default.jpg`
const FALLBACK_WIDTH = 1200
const FALLBACK_HEIGHT = 630

const talksDir = 'talks'
const slugs = readdirSync(talksDir).filter((f) => statSync(join(talksDir, f)).isDirectory())

function escapeHtml(s) {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
}

// Makes sure public/slides/<slug>/ has a cover for slide 1 as it is now,
// and returns its file name — or the last rendered one when it can't be
// rendered here, or null when there has never been one.
function ensureCover(slug, manifest) {
  const distDir = join('public', 'slides', slug)
  const wanted = coverFile(coverHash(distDir, manifest))
  const existing = existingCovers(distDir)
  if (!existing.includes(wanted)) {
    if (!canRender()) {
      console.warn(
        `warning: public/slides/${slug}/${wanted} is missing — slide 1 changed since its cover was rendered.\n` +
          `  Run \`npm run build\` where peitho and sips are installed, and commit the new cover.`,
      )
      return existing[0] ?? null
    }
    renderCover(join(talksDir, slug, 'deck.md'), join(distDir, wanted), manifest.canvasWidth, manifest.canvasHeight)
    console.log(`Rendered: public/slides/${slug}/${wanted}`)
  }
  for (const old of existing.filter((f) => f !== wanted)) unlinkSync(join(distDir, old))
  return wanted
}

// One line, short enough for a card's description.
function summarize(text, max = 120) {
  const line = text.replace(/\s+/g, ' ').trim()
  return line.length > max ? `${line.slice(0, max - 1)}…` : line
}

// Falls back to the site's default share image, same as renderer.tsx does
// for pages with no page-specific OGP image.
function patchIndexHtml(slug, manifest, cover) {
  const indexPath = join('public', 'slides', slug, 'index.html')
  const url = `${SITE_URL}/slides/${slug}/`
  const first = manifest.slides[0]?.text ?? {}
  const title = summarize(first.title || manifest.title)
  const escapedTitle = escapeHtml(title)
  const escapedDescription = escapeHtml(summarize(first.body || '') || title)
  const image = cover ? `${url}og.png` : FALLBACK_IMAGE
  const imageWidth = cover ? manifest.canvasWidth : FALLBACK_WIDTH
  const imageHeight = cover ? manifest.canvasHeight : FALLBACK_HEIGHT

  const lines = [
    `<title>${escapedTitle} — kobaken</title>`,
    `<meta name="description" content="${escapedDescription}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:title" content="${escapedTitle}">`,
    `<meta property="og:description" content="${escapedDescription}">`,
    `<meta property="og:site_name" content="kobaken.co">`,
    `<meta property="og:locale" content="ja_JP">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta property="og:image:width" content="${imageWidth}">`,
    `<meta property="og:image:height" content="${imageHeight}">`,
    `<meta property="og:type" content="website">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapedTitle}">`,
    `<meta name="twitter:description" content="${escapedDescription}">`,
    `<meta name="twitter:image" content="${image}">`,
    `<meta name="twitter:site" content="@kfly8">`,
    `<meta name="twitter:creator" content="@kfly8">`,
  ]
  // Wrapped in a marker comment pair so a second run (e.g. `npm run build`
  // twice without an intervening `peitho build`) replaces the whole
  // previously-injected block instead of stacking a duplicate one after
  // it — the plain <title> tag alone can't tell "pristine" and
  // "already-patched" apart, since the patched title still matches it.
  const block = `<!-- ogp:start -->\n  ${lines.join('\n  ')}\n  <!-- ogp:end -->`

  const original = readFileSync(indexPath, 'utf-8')
  const html = /<!-- ogp:start -->[\s\S]*?<!-- ogp:end -->/.test(original)
    ? original.replace(/<!-- ogp:start -->[\s\S]*?<!-- ogp:end -->/, block)
    : original.replace(/<title>[^<]*<\/title>/, block)
  writeFileSync(indexPath, html)
}

const slides = slugs
  .map((slug) => {
    const manifestPath = join('public', 'slides', slug, 'manifest.json')
    if (!existsSync(manifestPath)) return null

    const talkJsonPath = join(talksDir, slug, 'talk.json')
    if (!existsSync(talkJsonPath)) {
      throw new Error(
        `talks/${slug}/ is built (public/slides/${slug}/manifest.json exists) but has no talk.json.\n` +
          `  Create it: echo '{ "date": "YYYY-MM-DD" }' > talks/${slug}/talk.json`,
      )
    }
    const { date } = JSON.parse(readFileSync(talkJsonPath, 'utf-8'))
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? '')) {
      throw new Error(`talks/${slug}/talk.json: "date" must be YYYY-MM-DD, got ${JSON.stringify(date)}`)
    }

    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
    const cover = ensureCover(slug, manifest)
    patchIndexHtml(slug, manifest, cover)
    return { slug, date, title: manifest.title, cover }
  })
  .filter((t) => t !== null)
  .sort((a, b) => b.date.localeCompare(a.date))

mkdirSync('dist', { recursive: true })
writeFileSync(
  join('dist', 'slides.ts'),
  `// Code generated by scripts/generate-slides.mjs. DO NOT EDIT.\nexport const SLIDES = ${JSON.stringify(slides, null, 2)} as const\n`,
)
console.log(`Generated: dist/slides.ts (${slides.length} talk(s), ${slugs.length - slides.length} unbuilt)`)
