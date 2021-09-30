---
title: generateWS | Workbox
---

# generateWS

You must read [Which Mode to Use](https://developers.google.com/web/tools/workbox/modules/workbox-build#which_mode_to_use) <outbound-link />
before decide using this strategy on `vite-plugin-pwa` plugin.

You can find the documentation for this method on `workbox` site: [generateWS](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.generateSW) <outbound-link />.

You can find a guide for plugins on `workbox` site: [Using Plugins](https://developers.google.com/web/tools/workbox/guides/using-plugins) <outbound-link />.

## Missing assets from SW precache manifest

If you encounter that some asset is missing from the service worker precache manifest, you should review if it exceeds the
`maximumFileSizeToCacheInBytes`, the default value is **2MiB**.

You can increase the value to your needs, for example to allow assets up to **3MB**:
```ts
workbox: {
  maximumFileSizeToCacheInBytes: 3000000  
}
```

When some asset exceeds the `maximumFileSizeToCacheInBytes` value, it will be logged to the console when building
your project: **available only from version 0.11.3**.

For example, if we configure `workbox` plugin option with:
```ts
workbox: {
  maximumFileSizeToCacheInBytes: 100  
}
```

you will see on the console messages like following, **available only from version 0.11.3**:

```shell
VitePWAPlugin workbox-build::generateSW warnings:
  - assets/[name].19b70817.js is 468 B, and won't be precached. Configure maximumFileSizeToCacheInBytes to change this limit.
  - assets/about.dbc02b0b.js is 379 B, and won't be precached. Configure maximumFileSizeToCacheInBytes to change this limit.
  - assets/home.49c5ea42.js is 828 B, and won't be precached. Configure maximumFileSizeToCacheInBytes to change this limit.
  - assets/index.09ee2ee1.js is 3.71 kB, and won't be precached. Configure maximumFileSizeToCacheInBytes to change this limit.
  - assets/index.40de6d3d.css is 461 B, and won't be precached. Configure maximumFileSizeToCacheInBytes to change this limit.
  - assets/my-worker.5c299b37.js is 192 B, and won't be precached. Configure maximumFileSizeToCacheInBytes to change this limit.
  - assets/vendor.31de95e7.js is 79.1 kB, and won't be precached. Configure maximumFileSizeToCacheInBytes to change this limit.
  - index.html is 777 B, and won't be precached. Configure maximumFileSizeToCacheInBytes to change this limit.
```

If there are warnings when building your service worker via `generateSW` from `workbox-build`, all these warnings
will be logged to console: **available only from version 0.11.3**.

## Log `injecManifest` result

From version `0.11.3`, the result of `generateSW` from `workbox-build` will be logged when `vite.logLevel` is `undefined`
or `info`.

Once you run the `build` command, you will see messages like following on console:
```shell
VitePWAPlugin workbox-build::generateSW result:
  - Total number of precached entries: 12 entries
  - Aggregate size of all the precached entries: 85895 bytes
  - Written to swDest:
    - <root>/dist/sw.js
    - <root>/dist/workbox-4c95f9b5.js
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
