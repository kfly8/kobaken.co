// Renders a built talk's first slide to a PNG, the image behind its
// /slides/<slug>/og.png share card (served by slides/ogp.ts).
//
// The PNG is named after a hash of what slide 1 looks like —
// og-cover-<hash>.png, next to the built deck in public/slides/<slug>/ —
// so whether it's up to date is just whether that file exists, and the
// Worker can use the hash as the image's ETag without reading the file.
// Rendering shells out to `peitho export pdf` and macOS's `sips` (a few
// seconds a deck), so scripts/generate-slides.mjs only renders a cover
// that's missing, and is committed like the rest of the built deck. Where
// those tools aren't installed (a CI build), a missing cover is reported
// and the last rendered one, if any, keeps being served.

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const COVER = /^og-cover-[0-9a-f]{16}\.png$/

// Slide 1's built HTML plus the deck's CSS. Images slide 1 shows are
// named after their own content hash by `peitho build`, so a changed
// image changes the HTML too.
export function coverHash(distDir, manifest) {
  const hash = createHash('sha256')
  hash.update(readFileSync(join(distDir, manifest.slides[0].src)))
  hash.update(readFileSync(join(distDir, 'peitho.css')))
  return hash.digest('hex').slice(0, 16)
}

export const coverFile = (hash) => `og-cover-${hash}.png`

// The cover files already in a built deck (normally one).
export function existingCovers(distDir) {
  return readdirSync(distDir).filter((f) => COVER.test(f))
}

function hasCommand(name) {
  try {
    execFileSync('which', [name], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

export const canRender = () => hasCommand('peitho') && hasCommand('sips')

// Renders deckPath's slide 1 to outPath at the canvas size.
export function renderCover(deckPath, outPath, width, height) {
  const tmpDir = mkdtempSync(join(tmpdir(), 'slide-cover-'))
  try {
    const pdfPath = join(tmpDir, 'deck.pdf')
    execFileSync('peitho', ['export', 'pdf', deckPath, '-o', pdfPath], { stdio: 'ignore' })
    // sips only rasterizes a PDF's first page.
    const rawPngPath = join(tmpDir, 'cover.png')
    execFileSync('sips', ['-s', 'format', 'png', pdfPath, '--out', rawPngPath], { stdio: 'ignore' })
    execFileSync('sips', ['-z', String(height), String(width), rawPngPath, '--out', outPath], { stdio: 'ignore' })
  } finally {
    rmSync(tmpDir, { recursive: true, force: true })
  }
  if (!existsSync(outPath)) throw new Error(`rendering ${deckPath}'s cover wrote no ${outPath}`)
}
