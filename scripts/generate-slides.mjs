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
// Runs before `vite build` in the dev/build/deploy scripts.

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const SITE_URL = 'https://kobaken.co'
const FALLBACK_IMAGE = `${SITE_URL}/static/img/kobaken.jpg`

const talksDir = 'talks'
const slugs = readdirSync(talksDir).filter((f) => statSync(join(talksDir, f)).isDirectory())

function escapeHtml(s) {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
}

// scripts/generate-slide-ogp.mjs writes public/slides/<slug>/og.png (a
// one-off, not run on every build — see that file). Falls back to the
// site's default share image, same as renderer.tsx does for pages with no
// page-specific OGP image.
function patchIndexHtml(slug, title, canvasWidth, canvasHeight) {
  const indexPath = join('public', 'slides', slug, 'index.html')
  const url = `${SITE_URL}/slides/${slug}/`
  const hasOgImage = existsSync(join('public', 'slides', slug, 'og.png'))
  const image = hasOgImage ? `${url}og.png` : FALLBACK_IMAGE
  const escapedTitle = escapeHtml(title)

  const lines = [
    `<title>${escapedTitle} — kobaken</title>`,
    `<meta name="description" content="${escapedTitle}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:title" content="${escapedTitle}">`,
    `<meta property="og:description" content="${escapedTitle}">`,
    `<meta property="og:site_name" content="kobaken.co">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${image}">`,
    ...(hasOgImage
      ? [
          `<meta property="og:image:width" content="${canvasWidth}">`,
          `<meta property="og:image:height" content="${canvasHeight}">`,
        ]
      : []),
    `<meta property="og:type" content="website">`,
    `<meta name="twitter:card" content="${hasOgImage ? 'summary_large_image' : 'summary'}">`,
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

    const { title, canvasWidth, canvasHeight } = JSON.parse(readFileSync(manifestPath, 'utf-8'))
    patchIndexHtml(slug, title, canvasWidth, canvasHeight)
    return { slug, date, title }
  })
  .filter((t) => t !== null)
  .sort((a, b) => b.date.localeCompare(a.date))

mkdirSync('dist', { recursive: true })
writeFileSync(
  join('dist', 'slides.ts'),
  `// Code generated by scripts/generate-slides.mjs. DO NOT EDIT.\nexport const SLIDES = ${JSON.stringify(slides, null, 2)} as const\n`,
)
console.log(`Generated: dist/slides.ts (${slides.length} talk(s), ${slugs.length - slides.length} unbuilt)`)
