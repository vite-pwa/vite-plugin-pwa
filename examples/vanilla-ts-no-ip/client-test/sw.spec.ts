import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

const swName = 'custom-sw.js'

const findCache = async (page: Page) => {
  return await page.evaluate(async () => {
    const cacheState: Record<string, Array<string>> = {}
    for (const cacheName of await caches.keys()) {
      const cache = await caches.open(cacheName)
      cacheState[cacheName] = (await cache.keys()).map(req => req.url)
    }
    return cacheState
  })
}

test('TypeScript (no injection point): The service worker is registered', async ({ page }) => {
  await page.goto('/')

  const swURL = await page.evaluate(async () => {
    const registration = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise((_resolve, reject) => setTimeout(() => reject(new Error('Service worker registration failed: time out')), 10000)),
    ])
    // @ts-expect-error registration is of type unknown
    return registration.active?.scriptURL
  })
  expect(swURL).toBe(`http://localhost:4173/${swName}`)

  let cacheContents = await findCache(page)

  expect(Object.keys(cacheContents).length).toEqual(0)

  await page.reload({ timeout: 1000 })

  await page.evaluate(async () => {
    await Promise.race([
      navigator.serviceWorker.ready,
      new Promise((_resolve, reject) => setTimeout(() => reject(new Error('Service worker registration failed: time out')), 10000)),
    ])
  })

  cacheContents = await findCache(page)

  expect(Object.keys(cacheContents).length).toEqual(3)

  /*
  {
    pages: [ 'http://localhost:4173/' ],
    assets: [
      'http://localhost:4173/assets/index.65a98a41.js',
      'http://localhost:4173/assets/workbox-window.prod.es5.f4b3e527.js'
    ],
    images: [ 'http://localhost:4173/favicon.svg' ]
  }
  */

  let key = 'pages'

  expect(cacheContents[key]).toBeDefined()
  let urls = cacheContents[key].map(url => url.slice('http://localhost:4173/'.length))
  expect(urls.length).toEqual(1)
  expect(urls.includes('')).toEqual(true)

  key = 'assets'
  expect(cacheContents[key]).toBeDefined()
  urls = cacheContents[key].map(url => url.slice('http://localhost:4173/'.length))
  expect(urls.length).toEqual(2)
  expect(urls.some(url => url.startsWith('assets/index.'))).toEqual(true)

  key = 'images'
  expect(cacheContents[key]).toBeDefined()
  urls = cacheContents[key].map(url => url.slice('http://localhost:4173/'.length))
  expect(urls.length).toEqual(1)
  expect(urls.includes('favicon.svg')).toEqual(true)
})
