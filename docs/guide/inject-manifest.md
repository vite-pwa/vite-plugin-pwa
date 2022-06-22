---
title: Advanced (injectManifest) | Guide
---

# Advanced (injectManifest)

With this service worker `strategy` you can build your own service worker.

The `vite-plugin-pwa` plugin will compile your custom service worker and inject its service worker's precache manifest.

By default, the plugin will assume the `service worker` source code is located at the `Vite's public` folder with the name `sw.js`, that's, it will search in the following file: `/public/sw.js`. 

If you want to change the location and/or the service worker name, you will need to change the following plugin options:
- `srcDir`: **must** be relative to the project root folder 
- `filename`: including the file extension and **must** be relative to the `srcDir` folder

For example, if your service worker is located at `/src/my-sw.js` you must configure it using:
```ts
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
  plugins: [
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'my-sw.js'
    })
  ]
})
```

## Custom Service worker

We recommend you to use [Workbox](https://developers.google.com/web/tools/workbox) to build your service worker instead using `importScripts`, you will need to include `workbox-*` dependencies as `dev dependencies` to your project.

### Plugin Configuration

You **must** configure `strategies: 'injectManifest'` in `vite-plugin-pwa` plugin options in your `vite.config.ts` file:

```ts
VitePWA({
  strategies: 'injectManifest',
})
```

### Service Worker Code

Your custom service worker (`public/sw.js`) should have at least this code (you also need to install `workbox-precaching` as `dev dependency` to your project):
```js
import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)
```

### Cleanup Outdated Caches

<CleanupOutdatedCaches />

<InjectManifestCleanupOutdatedCaches />

### Generate SW Source Map

<InjectManifestSourceMap />

## Auto Update Behavior

If you need your custom service worker works with `Auto Update` behavior, you need to change the plugin configuration options and add some custom code to your service worker code.

### Plugin Configuration

You must configure `registerType: 'autoUpdate'` to `vite-plugin-pwa` plugin options in your `vite.config.ts` file:

```ts
VitePWA({
  registerType: 'autoUpdate'
})
```

### Service Worker Code

You **must** include in your service worker code at least this code (you also need to install `workbox-core` as `dev dependency` to your project):

```js
import { clientsClaim } from 'workbox-core'

self.skipWaiting()
clientsClaim()
```

## Prompt For Update Behavior

If you need your custom service worker works with `Prompt For Update` behavior, you need to change your service worker code.

### Service Worker Code

You need to include on your service worker at least this code:

```js
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING')
    self.skipWaiting()
})
```

## TypeScript support 

You can use TypeScript to write your custom service worker. To resolve service worker types, just add `WebWorker` to `lib` entry on your `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "lib": ["ESNext", "DOM", "WebWorker"]
  }
}
```

### Plugin Configuration

We recommend you to put your custom service worker inside `src` directory. 

You need to configure `srcDir: 'src'` and `filename: 'sw.ts'` plugin options in your `vite.config.ts` file, configure both options with the directory and the name of your custom service worker properly:

```ts
VitePWA({
  srcDir: 'src',
  filename: 'sw.ts'
})
```

### Service Worker Code

You need to define `self` scope with `ServiceWorkerGlobalScope`:

```ts
import { precacheAndRoute } from 'workbox-precaching'

declare let self: ServiceWorkerGlobalScope

precacheAndRoute(self.__WB_MANIFEST)
```
