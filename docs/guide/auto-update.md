# Automatic reload

> In order for the service worker to be registered, you must invoke the` registerSW`
method from the `virtual:pwa-register` module.

With this option, once the service worker detects new content available, then it will update caches and
will reload all browser windows/tabs with the application opened automatically to take the control.

The disadvantage of using this option is that the user can lose data in other browser windows / tabs in which the
application is open and is filling in a form.

If your application has forms, we recommend you to change the behavior to use default `prompt` option to allow
the user decide when to update the content of the application.

## Setup

Go to [Generate Service Worker](/guide/generate.html) section for basic configuration options.

With this option, the plugin will force `workbox.clientsClaim` and `workbox.skipWaiting` to `true`.

You must add `registerType: 'autoUpdate'` to `Vite PWA` options in your `vite.config.ts` file:

```ts
VitePWA({
  registerType: 'autoUpdate'
})
```

## Runtime

```ts
// main.ts
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onOfflineReady() {
    // show a ready to work offline to user
  },
})
```

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

