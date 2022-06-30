---
title: generateSW | Workbox
---

# generateSW

You must read [Which Mode to Use](https://developer.chrome.com/docs/workbox/modules/workbox-build/#which-mode-to-use) before decide using this strategy on `vite-plugin-pwa` plugin.

You can find the documentation for this method on `workbox` site: [generateSW](https://developer.chrome.com/docs/workbox/reference/workbox-build/#method-generateSW).

You can find a guide for plugins on `workbox` site: [Using Plugins](https://developers.google.com/web/tools/workbox/guides/using-plugins).

## Cache External Resources

If you use some `CDN` to download some resources like `fonts` and `css`, you must include them into the service worker precache, and so your application will work when offline.

The following example will use `css` from `https://fonts.googleapis.com` and `fonts` from `https://fonts.gstatic.com`.

On `index.html` file you must configure the `css` `link`, you **MUST** also include `crossorigin="anonymous"` attribute for the external resources  (see [Handle Third Party Requests](https://developers.google.com/web/tools/workbox/guides/handle-third-party-requests)):

::: details index.html
```html
<head>
  <link rel="dns-prefetch" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://fonts.gstatic.com">
  <link rel="preconnect" crossorigin="anonymous" href="https://fonts.googleapis.com">
  <link rel="preconnect" crossorigin="anonymous" href="https://fonts.gstatic.com">
  <link rel="stylesheet" crossorigin="anonymous" href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" />
</head>
```
:::

Then on your `vite.config.ts` file add the following code:

::: details VitePWA options
```ts
VitePWA({
  workbox: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'gstatic-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          },
        }
      }
    ]
  }
})
```
:::

## Exclude routes

To exclude some routes from being intercepted by the service worker, you just need to add those routes using a `regex` list to the `navigateFallbackDenylist` option of `workbox`:

```ts
VitePWA({
  workbox: {
    navigateFallbackDenylist: [/^\/backoffice/]
  }
})
```

::: warning
You must deal with offline support for excluded routes: if requesting a page excluded on `navigateFallbackDenylist` you will get `No internet connection`.
:::

## Background Sync

You can add this code to the plugin on your `vite.config.ts` file to add a `Background Sync` manager to your service worker:

::: details VitePWA options
```ts
VitePWA({
  workbox: {
    runtimeCaching: [{
      handler: 'NetworkOnly',
      urlPattern: /\/api\/.*\/*.json/,
      method: 'POST',
      options: {
        backgroundSync: {
          name: 'myQueueName',
          options: {
            maxRetentionTime: 24 * 60
          }
        }
      }
    }]
  }
})
```
:::
