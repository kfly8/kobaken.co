import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
const base = process.argv[2] || 'http://localhost:8787'
const get = async (path, init) => fetch(new URL(path, base), { redirect: 'manual', signal: AbortSignal.timeout(60000), ...init })
const manifest = await (await get('/slides/peitho-studio/manifest.json')).json()
const cards = []
for (const n of [1, 2, manifest.slides.length]) {
  const response = await get(`/slides/peitho-studio/${n}`)
  assert.equal(response.status, 200, `page ${n}`)
  const html = await response.text()
  const title = html.match(/<meta property="og:title" content="([^"]*)"/)[1]
  assert.equal(title.replaceAll('&#39;', "'").replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&'), manifest.slides[n - 1].text.title, `page ${n} title`)
  assert.ok(html.includes(`https://kobaken.co/slides/peitho-studio/${n}`), `page ${n} canonical`)
  const encodedImage = html.match(/<meta property="og:image" content="([^"]*)"/)[1]
  const image = new URL(encodedImage.replaceAll('&amp;', '&'))
  assert.equal(image.search, '', 'OG image has no query parameters')
  assert.equal((html.match(/property="og:image"/g) || []).length, 1)
  assert.match(response.headers.get('cache-control'), /public/)
  const head = await get(image.pathname, { method: 'HEAD' })
  assert.equal(head.status, 200)
  assert.match(head.headers.get('cache-control'), /max-age=604800/)
  const etag = head.headers.get('etag')
  assert.ok(etag)
  assert.equal((await get(image.pathname, { headers: { 'If-None-Match': etag } })).status, 304)
  cards.push({ slug: 'peitho-studio', n, path: image.pathname, width: manifest.canvasWidth, height: manifest.canvasHeight })
  console.log(`PASS page ${n}, metadata, query-free image URL, cache headers, ETag`)
}
for (const suffix of ['0', '-1', '1.5', '999', '2abc']) {
  const res = await get(`/slides/peitho-studio/${suffix}`)
  assert.equal(res.status, 404, suffix)
  assert.match(res.headers.get('cache-control'), /no-store/)
}
const legacy = await get('/slides/peitho-studio/?slide=2')
assert.ok([301, 302, 307, 308].includes(legacy.status))
assert.equal(new URL(legacy.headers.get('location'), base).pathname, '/slides/peitho-studio/2')
assert.equal(new URL(legacy.headers.get('location'), base).search, '')
console.log('PASS invalid pages and legacy query redirect')
for (const path of ['/slides/%70eitho-studio/2', '/slides/peitho-studio/%32', '/slides/peitho-studio/2/']) {
  const res = await get(path)
  assert.equal(res.status, 308)
  assert.equal(new URL(res.headers.get('location'), base).pathname, '/slides/peitho-studio/2')
}
console.log('PASS encoded and trailing slash aliases')
if (process.argv.includes('--images')) {
  for (const [slug, n] of [['peitho-studio', 3], ['peitho-studio', 4], ['sample-talk', 2], ['barefootjs-testing', 1]]) {
    const deck = await (await get(`/slides/${slug}/manifest.json`)).json()
    const html = await (await get(`/slides/${slug}/${n}`)).text()
    const image = new URL(html.match(/<meta property="og:image" content="([^"]*)"/)[1])
    cards.push({ slug, n, path: image.pathname, width: deck.canvasWidth, height: deck.canvasHeight })
  }
  const images = []
  for (const card of cards) {
    const res = await get(card.path)
    const bytes = Buffer.from(await res.arrayBuffer())
    assert.equal(res.status, 200, `image ${card.n}: ${bytes.toString('utf8', 0, 100)}`)
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a')
    assert.equal(bytes.readUInt32BE(16), card.width)
    assert.equal(bytes.readUInt32BE(20), card.height)
    const file = join(tmpdir(), `kobaken-${card.slug}-${card.n}.png`)
    await writeFile(file, bytes)
    images.push(bytes)
    console.log(`PASS ${card.slug}/${card.n}, ${card.width}x${card.height}, ${bytes.length} bytes, ${file}`)
  }
  assert.ok(!images[0].equals(images[1]), 'page 1 and 2 must differ')
  console.log('PASS distinct page images')
}
