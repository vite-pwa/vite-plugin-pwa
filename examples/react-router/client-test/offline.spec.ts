import { expect, test } from '@playwright/test'

const injectManifest = process.env.SW === 'true'
const swName = `${injectManifest ? 'claims-sw.js' : 'sw.js'}`

test('React: Test offline', async ({ browser }) => {
  // test offline + trailing slashes routes
  const context = await browser.newContext()
  const offlinePage = await context.newPage()
  await offlinePage.goto('/')
  const offlineSwURL = await offlinePage.evaluate(async () => {
    const registration = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Service worker registration failed: time out')), 10000)),
    ])
    // @ts-expect-error registration is of type any
    return registration.active?.scriptURL
  })
  expect(offlineSwURL).toBe(`http://localhost:4173/${swName}`)
  await context.setOffline(true)
  const aboutAnchor = offlinePage.getByRole('link', { name: 'About' })
  expect(await aboutAnchor.getAttribute('href')).toBe('/about')
  await aboutAnchor.click({ noWaitAfter: false })
  const url = await offlinePage.evaluate(async () => {
    await new Promise(resolve => setTimeout(resolve, 3000))
    return location.href
  })
  expect(url).toBe('http://localhost:4173/about')
  expect(offlinePage.locator('a').getByText('Go Home')).toBeTruthy()
  await offlinePage.reload({ waitUntil: 'load' })
  expect(offlinePage.url()).toBe('http://localhost:4173/about')
  expect(offlinePage.locator('a').getByText('Go Home')).toBeTruthy()
  // Dispose context once it's no longer needed.
  await context.close()
})
