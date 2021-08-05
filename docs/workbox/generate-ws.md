# generateWS

You must read [Which Mode to Use](https://developers.google.com/web/tools/workbox/modules/workbox-build#which_mode_to_use) <outbound-link />
before decide using this strategy on `vite-plugin-pwa` plugin.

You can find the documentation for this method on `workbox` site: [generateWS](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.generateSW) <outbound-link />

## Cache external resources

If you use some `CDN` to download some resources like `fonts` and `css` you must include them into the service worker
precache, and so your application can work when offline.

> You also need to add the logic to interact from the client logic: [Generate Service Worker](/guide/generate.html).

The following example will use `css` from `https://fonts.gstatic.com` and `fonts` from `https://fonts.googleapis.com`.

On `index.html` file we must configure the `css`, you **MUST** include `crossorigin="anonymous"` for the external resources:

```html
<head>
  <link rel="dns-prefetch" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://fonts.gstatic.com">
  <link rel="preconnect" crossorigin="anonymous" href="https://fonts.googleapis.com">
  <link rel="preconnect" crossorigin="anonymous" href="https://fonts.gstatic.com">
  <link rel="stylesheet" crossorigin="anonymous" href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" />
</head>
```

Then on your `vite.config.ts` file add the following code:

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

## Background Sync

You can add this code to the plugin on your `vite.config.ts` to add a `Background Sync` manager to your service worker:

> You also need to add the logic to interact from the client logic: [Generate Service Worker](/guide/generate.html).

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
