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

<HeuristicWorkboxWindow />
