---
title: Advanced (injectManifest) | Guide
---

# Advanced (injectManifest)

With this option you can build your own service worker.

## Custom Service worker

We recommend use [Workbox](https://developers.google.com/web/tools/workbox) <outbound-link /> to build your service worker,
you will need to include `workbox-*` dependencies as `dev dependencies` to your project.

### Setup

Go to [Generate Service Worker](/guide/generate.html) section for basic configuration options.

You must add `strategies: 'injectManifest'` to `Vite PWA` options in your `vite.config.ts` file:

```ts
VitePWA({
  strategies: 'injectManifest',
})
```

### Runtime

Your custom service worker (`public/sw.js`) should have at least this code:
```js
import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)
```

### Cleanup Outdated Caches

<CleanupOutdatedCaches />

<InjectManifestCleanupOutdatedCaches />

### Generate SW Source Map

<InjectManifestSourceMap />

## Prompt for new content

If you need your custom service worker works with `Prompt for new content` behavior, you need to change
your service worker code.

### Runtime

You need to include on your service worker at least this code:

```js
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING')
    self.skipWaiting()
})
```

> You also need to add the code to your application described on [Prompt for new content refreshing](/guide/prompt-for-update.html#runtime)

## Auto update for new content

If you need your custom service worker works with `Auto update for new content` behavior, you need to change
your service worker code and the plugin configuration options.

### Setup

You must add `registerType: 'autoUpdate'` to `Vite PWA` options in your `vite.config.ts` file:

```ts
VitePWA({
  registerType: 'autoUpdate'
})
```

### Runtime

Include on your service worker at least this code (you also need to install `workbox-core` as `dev dependency`
to your project):

```js
import { clientsClaim } from 'workbox-core'

self.skipWaiting()
clientsClaim()
```

> You also need to add the code to your application described on [Automatic reload](/guide/auto-update.html#runtime)


## TypeScript support 

You can use TypeScript to write your custom service worker. To resolve service worker types, just add `WebWorker` to `lib` 
entry on your `tsconfig.json` file:

```json
"lib": ["ESNext", "DOM", "WebWorker"],
```

### Setup

We recommend you to put your custom service worker on `src` directory. 

You need to add `srcDir: 'src'` and `filename: 'sw.ts'` options to `Vite PWA`  in your `vite.config.ts` file, 
configure both options with the directory and the name of your custom service worker properly:

```ts
VitePWA({
  srcDir: 'src',
  filename: 'sw.ts'
})
```

### Runtime

You need to define `self` scope with `ServiceWorkerGlobalScope`:

```ts
import { precacheAndRoute } from 'workbox-precaching'

declare let self: ServiceWorkerGlobalScope

precacheAndRoute(self.__WB_MANIFEST)
```
