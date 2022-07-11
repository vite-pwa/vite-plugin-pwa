---
title: Service Worker Precache | Guide
---

# Service Worker Precache

As we have mentioned in [Service Worker](/guide/#service-worker) section, service workers act as proxies intercepting requests between the browser and the server.

Since we are going to add PWA to your application, we need to configure the service worker so that your application can work offline. To do this, we need to configure the service worker's precache manifest, which will include all the resources of your application (basically we need to instruct the service worker what resources to store in cache storage so that it can be used for `network requests interception` and when the application is offline).

::: tip Network requests interception
You can also configure how to control the network requests interception for any of your application resources.

You can find more information on [Workbox - Caching Strategies](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#caching-strategies).
:::

Once the application registers the service worker, the browser will try to install it downloading all the resources in the service worker's precache manifest. Once all the resources downloaded and stored in the cache storage by the browser, it will try to activate the service worker to take the control of the application.

::: tip
The browser **will only download all the resources** in the service worker's precache manifest if the service worker is not installed (first time the user visit your application) or if there is a new version of your application (if you change some resource in your application, the service worker will also change once you build the application, since its precache manifest is modified to include your changes). 

In any case, the browser **will always download all the resources in a background thread** and not in the main browser thread, this way people can use the application while the browser is trying to install the service worker.

You can check this website or the [VueUse docs site](https://vueuse.org/) in a private window, just open `Network Tab` on dev tools before visiting the sites: the browser will start download all the resources while you navigate the site.
:::

## Precache Manifest

Since `vite-plugin-pwa` plugin uses [workbox-build](https://developer.chrome.com/docs/workbox/modules/workbox-build/) node library to build the service worker, it will only include `css`, `js` and `html` resources in the manifest precache (check the `globPatterns` entry in [GlobPartial](https://developer.chrome.com/docs/workbox/reference/workbox-build/#type-GlobPartial)).

`workbox-build` node library is file based, that is, it will traverse the build output folder of your application. `Vite` will generate your build in the `dist` folder, and so, `workbox-build` will traverse the `dist` folder adding all resources found in it to the service worker's precache manifest.

If you need to include another resource types, you will need to add them to the `globPatterns` entry. Depending on the `strategy` configured in the `vite-plugin-pwa` plugin configuration, you will need to add it under the `workbox` or `injectManifest` configuration option.

You can find more information in the [Static assets handling](/guide/static-assets) section.

For example, if you need to add `ico`, `png` and `svg` resources in the example from the [Configuring vite-plugin-pwa - Guide](/guide/#configuring-vite-plugin-pwa) section, you will need to add `globPatterns` under `workbox` entry, since we're using the default `vite-plugin-pwa` strategy (`generateSW`):
```ts
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
})
```
