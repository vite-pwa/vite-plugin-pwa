# Periodic Service Worker Updates

As explained in [Manual Updates](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#manual_updates) <outbound-link />
entry on `The Service Worker Lifecycle`, you can use this code to configure periodic service worker updates on your 
application on your `main.ts` or `main.js`:

<details open>
  <summary><strong>main.ts / main.js</strong> code</summary>

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
</details>

The interval must be in milliseconds, in the example above it is configured to check the service worker every hour.

> Since `workbox-window` uses a time-based `heuristic` algorithm to handle service worker updates, if you
build your service worker and register it again, if the time between last registration and the new one is less than
1 minute, then, `workbox-window` will handle the `service worker update found` event as an external event, and so the
behavior could be strange (for example, if using `prompt`, instead showing the dialog for new content available, the
ready  to work offline dialog will be shown; if using `autoUpdate`, the ready to work offline dialog will be shown and
shouldn't be shown).
