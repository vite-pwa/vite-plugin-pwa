# Prompt for new content refreshing

<prompt-for-update-img />

> This is the default option when `strategies` and `registerType` are not configured.
In order for the service worker to be registered, you must invoke the `registerSW` method
from the `virtual:pwa-register` module.

## Setup

Go to [Generate Service Worker](/guide/generate.html) section for basic configuration options.

## Runtime

You must include the following code on your `main.ts` or `main.js` file:
```ts
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    // show a prompt to user with refresh and cancel buttons
  },
  onOfflineReady() {
    // show a ready to work offline message to user
  },
})
```

when user clicked the "refresh" button then call `updateSW()` function; the page will reload and the up-to-date 
content will be served.

### SSR/SSG

If you are using `SSR/SSG`, you need to import `virtual:pwa-register` module using dynamic import and checking if
`window` is not `undefined`:

```ts
// pwa.ts
import { registerSW } from 'virtual:pwa-register'
registerSW({ /* options */})
```

```ts
// main.ts
if (typeof window !== 'undefined') {
    import('./pwa')
}
```

