import { clientsClaim } from 'workbox-core'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'

declare let self: ServiceWorkerGlobalScope

self.skipWaiting()
clientsClaim()

if (import.meta.env.DEV) {
  // Avoid caching on dev: force always go to the server
  registerRoute(
    () => true,
    new NetworkFirst({
      cacheName: 'all-dev',
      plugins: [
        new CacheableResponsePlugin({ statuses: [-1] }),
      ],
    }),
  )
}

if (import.meta.env.PROD) {
  // Cache page navigations (html) with a Network First strategy
  registerRoute(
    ({ request }) => {
      return request.mode === 'navigate'
    },
    new NetworkFirst({
      cacheName: 'pages',
      plugins: [
        new CacheableResponsePlugin({ statuses: [200] }),
      ],
    }),
  )

  // Cache CSS, JS, and Web Worker requests with a Stale While Revalidate strategy
  registerRoute(
    ({ request }) =>
      request.destination === 'style'
            || request.destination === 'manifest'
            || request.destination === 'script'
            || request.destination === 'worker',
    new StaleWhileRevalidate({
      cacheName: 'assets',
      plugins: [
        new CacheableResponsePlugin({ statuses: [200] }),
      ],
    }),
  )

  // Cache images with a Cache First strategy
  registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
      cacheName: 'images',
      plugins: [
        new CacheableResponsePlugin({ statuses: [200] }),
        // 50 entries max, 30 days max
        new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 }),
      ],
    }),
  )
}
