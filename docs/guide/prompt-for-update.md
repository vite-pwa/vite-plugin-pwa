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
  onNeedRefresh() {},
  onOfflineReady() {},
})
```

You will need to:
- show a prompt to the user with refresh and cancel buttons inside `onNeedRefresh` method.
- show a ready to work offline message to the user with an OK button inside `onOfflineReady` method.

When the user clicked the "refresh" button when `onNeedRefresh` called, then call `updateSW()` function; the page will 
reload and the up-to-date content will be served.

In any case, when the user click the `Cancel` or `OK` buttons, just hide the prompt shown on `onNeedRefresh` or 
`onOfflineReady` methods.

### SSR/SSG

If you are using `SSR/SSG`, you need to import `virtual:pwa-register` module using dynamic import and checking if
`window` is not `undefined`.

You can register the service worker on `src/pwa.ts` module:

```ts
import { registerSW } from 'virtual:pwa-register'

registerSW({ ... })
```

and then import it from your `maint.ts`:

```ts
if (typeof window !== 'undefined') {
  import('./pwa')
}
```

