---
title: Periodic Service Worker Updates | Guide
---

# Periodic Service Worker Updates

:::info
If you're not importing any of the virtual modules provided by `vite-plugin-pwa` you'll need to figure out how to configure it, it is out of the scope of this guide.
:::

As explained in [Manual Updates](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#manual-updates) entry in [The Service Worker Lifecycle](https://web.dev/service-worker-lifecycle/) article, you can use this code to configure periodic service worker updates on your application on your `main.ts` or `main.js`:

::: details main.ts / main.js
```ts
import { registerSW } from 'virtual:pwa-register'

const intervalMS = 60 * 60 * 1000

const updateSW = registerSW({
  onRegistered(r) {
    r && setInterval(() => {
      r.update()
    }, intervalMS)
  }
})
```
:::

The interval must be in milliseconds, in the example above it is configured to check the service worker every hour.

## Handling Edge Cases

::: info
From version `0.12.8+` we have a new option, `onRegisteredSW`, and `onRegistered` has been deprecated. If `onRegisteredSW` is present, `onRegistered` will never be called.
:::

Previous script will allow you to check if there is a new version of your application available, but you will need also to deal with some edge cases like:
- server is down when calling the update method
- the user can go offline at any time

To mitigate previous problems, use this more complex snippet:

::: details main.ts / main.js
```ts
import { registerSW } from 'virtual:pwa-register'

const intervalMS = 60 * 60 * 1000

const updateSW = registerSW({
  onRegisteredSW(swUrl, r) {
    r && setInterval(async () => {
      if (!(!r.installing && navigator))
        return

      if (('connection' in navigator) && !navigator.onLine)
        return

      const resp = await fetch(swUrl, {
        'cache': 'no-store',
        'cache-control': 'no-cache'
      })

      if (resp?.status === 200)
        await r.update()
    }, intervalMS)
  }
})
```
:::

<HeuristicWorkboxWindow />
