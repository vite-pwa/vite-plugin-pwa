---
title: injectManifest | Workbox
---

# injectManifest

You must read [Which Mode to Use](https://developers.google.com/web/tools/workbox/modules/workbox-build#which_mode_to_use) <outbound-link />
before decide using this strategy on `vite-plugin-pwa` plugin.

Before writing your custom service worker, check if `workbox` can generate the code for you using `generateWS` strategy,
looking for some plugin on `workbox` site on [Runtime Caching Entry](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.RuntimeCachingEntry) <outbound-link />.

You can find the documentation for this method on `workbox` site: [injectManifest](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.injectManifest) <outbound-link />

## Network First Strategy

You can use the following code to create your custom service worker to be used with network first strategy. We also include
how to configure [Custom Cache Network Race Strategy](https://jakearchibald.com/2014/offline-cookbook/#cache--network-race) <outbound-link />.

<details>
  <summary><strong>VitePWA options</strong> code</summary>

```ts
VitePWA({
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'sw.ts'
})
```
</details>

> You also need to add the logic to interact from the client logic: [Advanced (injectManifest)](/guide/inject-manifest.html).

Then in your `src/sw.ts` file, remember you will also need to add following `workbox` dependencies as `dev`
dependencies:
- `workbox-core`
- `workbox-routing`
- `workbox-strategies`
- `workbox-build`

<details>
  <summary><strong>src/sw.ts</strong> code</summary>

```ts
/* eslint-disable no-console */
import { clientsClaim, cacheNames } from 'workbox-core'
import { registerRoute, setCatchHandler, setDefaultHandler } from 'workbox-routing'
import {
  NetworkFirst,
  NetworkOnly,
  Strategy,
  StrategyHandler,
} from 'workbox-strategies'
import { ManifestEntry } from 'workbox-build'

// Give TypeScript the correct global.
// @ts-ignore
declare let self: ServiceWorkerGlobalScope
declare type ExtendableEvent = any

const data = {
  race: false,
  debug: false,
  credentials: 'same-origin',
  networkTimeoutSeconds: 0,
  fallback: 'index.html'
}

const cacheName = cacheNames.runtime

const buildStrategy = (): Strategy => {
  if (race) {
    class CacheNetworkRace extends Strategy {
      _handle(request: Request, handler: StrategyHandler): Promise<Response | undefined> {
        const fetchAndCachePutDone: Promise<Response> = handler.fetchAndCachePut(request)
        const cacheMatchDone: Promise<Response | undefined> = handler.cacheMatch(request)

        return new Promise((resolve, reject) => {
          fetchAndCachePutDone.then(resolve).catch((e) => {
            if (debug)
              console.log(`Cannot fetch resource: ${request.url}`, e)
          })
          cacheMatchDone.then(response => response && resolve(response))

          // Reject if both network and cache error or find no response.
          Promise.allSettled([fetchAndCachePutDone, cacheMatchDone]).then((results) => {
            const [fetchAndCachePutResult, cacheMatchResult] = results
            // @ts-ignore
            if (fetchAndCachePutResult.status === 'rejected' && !cacheMatchResult.value)
              reject(fetchAndCachePutResult.reason)
          })
        })
      }
    }
    return new CacheNetworkRace()
  }
  else {
    if (networkTimeoutSeconds > 0)
      return new NetworkFirst({ cacheName, networkTimeoutSeconds })
    else
      return new NetworkFirst({ cacheName })
  }
}

const manifest = self.__WB_MANIFEST as Array<ManifestEntry>

const cacheEntries: RequestInfo[] = []

const manifestURLs = manifest.map(
  (entry) => {
    // @ts-ignore
    const url = new URL(entry.url, self.location)
    cacheEntries.push(new Request(url.href, {
      credentials: credentials as any
    }))
    return url.href
  }
)

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(cacheEntries)
    })
  )
})

self.addEventListener('activate', (event: ExtendableEvent) => {
  // - clean up outdated runtime cache
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      // clean up those who are not listed in manifestURLs
      cache.keys().then((keys) => {
        keys.forEach((request) => {
          debug && console.log(`Checking cache entry to be removed: ${request.url}`)
          if (!manifestURLs.includes(request.url)) {
            cache.delete(request).then((deleted) => {
              if (debug) {
                if (deleted)
                  console.log(`Precached data removed: ${request.url || request}`)
                else
                  console.log(`No precache found: ${request.url || request}`)
              }
            })
          }
        })
      })
    })
  )
})

registerRoute(
  ({ url }) => manifestURLs.includes(url.href),
  buildStrategy()
)

setDefaultHandler(new NetworkOnly())

// fallback to app-shell for document request
setCatchHandler(({ event }): Promise<Response> => {
  // @ts-ignore
  switch (event.request.destination) {
    case 'document':
      return caches.match(fallback).then((r) => {
        return r ? Promise.resolve(r) : Promise.resolve(Response.error())
      })
    default:
      return Promise.resolve(Response.error())
  }
})

// this is necessary, since the new service worker will keep on skipWaiting state
// and then, caches will not be cleared since it is not activated
self.skipWaiting()
clientsClaim()
```
</details>

## Server Push Notifications

You can use this code on your custom service worker (`src/sw.ts`) to enable `Server Push Notifications`:

> You also need to add the logic to interact from the client logic: [Advanced (injectManifest)](/guide/inject-manifest.html).

<details>
  <summary><strong>src/sw.ts</strong> code</summary>

```ts
function getEndpoint() {
  return self.registration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription) {
      return subscription.endpoint
    }

    throw new Error('User not subscribed')
  });
}

// Register event listener for the ‘push’ event.
self.addEventListener('push', function(event) {
  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    getEndpoint()
    .then(function(endpoint) {
      // Retrieve the textual payload from the server using a GET request. We are using the endpoint as an unique ID 
      // of the user for simplicity.
      return fetch('./getPayload?endpoint=' + endpoint)
    })
    .then(function(response) {
      return response.text()
    })
    .then(function(payload) {
      // Show a notification with title ‘ServiceWorker Cookbook’ and use the payload as the body.
      self.registration.showNotification('ServiceWorker Cookbook', {
        body: payload
      });
    })
  );
})
```
</details>
