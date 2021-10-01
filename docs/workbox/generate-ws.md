---
title: generateWS | Workbox
---

# generateWS

You must read [Which Mode to Use](https://developers.google.com/web/tools/workbox/modules/workbox-build#which_mode_to_use) <outbound-link />
before decide using this strategy on `vite-plugin-pwa` plugin.

You can find the documentation for this method on `workbox` site: [generateWS](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.generateSW) <outbound-link />.

You can find a guide for plugins on `workbox` site: [Using Plugins](https://developers.google.com/web/tools/workbox/guides/using-plugins) <outbound-link />.

## Missing assets from SW precache manifest

If you find any assets are missing from the service worker's precache manifest, you should check if they exceed the
`maximumFileSizeToCacheInBytes`, the default value is **2 MiB**.

You can increase the value to your needs, for example to allow assets up to **3 MiB**:

```ts
workbox: {
  maximumFileSizeToCacheInBytes: 3000000
}
```

## Cache External Resources

If you use some `CDN` to download some resources like `fonts` and `css`, you must include them into the service worker
precache, and so your application will work when offline.

> You also need to add the logic to interact from the client logic: [Generate Service Worker](/guide/generate.html).

The following example will use `css` from `https://fonts.googleapis.com` and `fonts` from `https://fonts.gstatic.com`.

On `index.html` file you must configure the `css` `link`, you **MUST** also include `crossorigin="anonymous"` attribute
for the external resources 
(see [Handle Third Party Requests](https://developers.google.com/web/tools/workbox/guides/handle-third-party-requests) <outbound-link />):

<details>
  <summary><strong>index.html</strong> code</summary>

```html
<head>
  <link rel="dns-prefetch" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://fonts.gstatic.com">
  <link rel="preconnect" crossorigin="anonymous" href="https://fonts.googleapis.com">
  <link rel="preconnect" crossorigin="anonymous" href="https://fonts.gstatic.com">
  <link rel="stylesheet" crossorigin="anonymous" href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" />
</head>
```
</details>

Then on your `vite.config.ts` file add the following code:

<details>
  <summary><strong>VitePWA options</strong> code</summary>

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
</details>

## Background Sync

You can add this code to the plugin on your `vite.config.ts` file to add a `Background Sync` manager to your service worker:

> You also need to add the logic to interact from the client logic: [Generate Service Worker](/guide/generate.html).

<details>
  <summary><strong>VitePWA options</strong> code</summary>

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
</details>
