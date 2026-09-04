// Renders talks/<slug>/deck.md's first slide to public/slides/<slug>/og.png,
// used as the page's OGP/Twitter card image — scripts/generate-slides.mjs
// wires it into public/slides/<slug>/index.html's <head> on every build.
//
// A one-off per talk (run again only if slide 1's content changes), not
// part of the npm build pipeline: it shells out to `peitho export pdf`
// and macOS's `sips`, and PDF-exporting the whole deck just to grab page 1
// is slow — too slow to redo on every `npm run dev`/`build`.
//
// Usage: node scripts/generate-slide-ogp.mjs <slug>

import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const slug = process.argv[2]
if (!slug) {
  console.error('Usage: node scripts/generate-slide-ogp.mjs <slug>')
  process.exit(1)
}

const deckPath = join('talks', slug, 'deck.md')
if (!existsSync(deckPath)) {
  console.error(`${deckPath} not found`)
  process.exit(1)
}

const manifestPath = join('public', 'slides', slug, 'manifest.json')
if (!existsSync(manifestPath)) {
  console.error(`${manifestPath} not found — run \`peitho build ${deckPath} --out public/slides/${slug}\` first`)
  process.exit(1)
}
const { canvasWidth, canvasHeight } = JSON.parse(readFileSync(manifestPath, 'utf-8'))

const tmpDir = mkdtempSync(join(tmpdir(), 'slide-ogp-'))
try {
  const pdfPath = join(tmpDir, 'deck.pdf')
  execFileSync('peitho', ['export', 'pdf', deckPath, '-o', pdfPath], { stdio: 'inherit' })

  // sips only rasterizes a PDF's first page.
  const rawPngPath = join(tmpDir, 'cover.png')
  execFileSync('sips', ['-s', 'format', 'png', pdfPath, '--out', rawPngPath], { stdio: 'inherit' })

  const outPath = join('public', 'slides', slug, 'og.png')
  execFileSync('sips', ['-z', String(canvasHeight), String(canvasWidth), rawPngPath, '--out', outPath], {
    stdio: 'inherit',
  })
  console.log(`Generated: ${outPath} (${canvasWidth}x${canvasHeight})`)
} finally {
  rmSync(tmpDir, { recursive: true, force: true })
}
