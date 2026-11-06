import { Buffer } from 'node:buffer'
import puppeteer from '@cloudflare/puppeteer'
import type { HTTPRequest } from '@cloudflare/puppeteer'
import type { SlideDeck } from './types'

export async function screenshotSlide({ deck, slide, env }: {
  deck: SlideDeck
  slide: SlideDeck['slides'][number]
  env: CloudflareBindings
}): Promise<ArrayBuffer> {
  const browser = await puppeteer.launch(env.BROWSER)
  const pending = new Set<Promise<void>>()
  const errors: unknown[] = []
  try {
    const page = await browser.newPage()
    await page.setViewport({ width: deck.width, height: deck.height, deviceScaleFactor: 1 })
    await page.setRequestInterception(true)
    const origin = 'https://slide-render.invalid'
    async function serve(request: HTTPRequest) {
      const url = new URL(request.url())
      if (url.pathname === '/favicon.ico') {
        await request.respond({ status: 204 })
        return
      }
      if (url.origin !== origin) {
        await request.continue()
        return
      }
      const assetUrl = new URL(url)
      if (url.pathname === `/slides/${deck.slug}/${slide.number}`) assetUrl.pathname = `/slides/${deck.slug}/`
      const response = await env.ASSETS.fetch(assetUrl)
      if (!response.ok) throw new Error(`Slide asset ${url.pathname}: ${response.status}`)
      const headers = Object.fromEntries(response.headers)
      delete headers['content-encoding']
      delete headers['content-length']
      await request.respond({ status: response.status, headers, body: Buffer.from(await response.arrayBuffer()) })
    }
    page.on('request', (request) => {
      const task = serve(request).catch(async (error: unknown) => {
        errors.push(error)
        if (!request.isInterceptResolutionHandled()) await request.abort().catch(() => {})
      })
      pending.add(task)
      void task.finally(() => pending.delete(task))
    })
    page.on('requestfailed', (request) => errors.push(new Error(`Slide request failed: ${request.url()}`)))
    const url = `${origin}/slides/${deck.slug}/${slide.number}`
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
    await page.waitForFunction((key: string) =>
      document.querySelector('#peitho-canvas .peitho-slide')?.getAttribute('data-slide-key') === key,
    { timeout: 10000 }, slide.key)
    await Promise.all(page.frames().map((frame) => frame.evaluate(async () => {
      await document.fonts.ready
      for (const image of document.images) await image.decode()
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
    })))
    await Promise.all(pending)
    if (errors.length) throw errors[0]
    const png = await page.screenshot({ type: 'png' })
    return new Uint8Array(png).buffer
  } finally {
    await Promise.allSettled(pending)
    await browser.close()
  }
}
