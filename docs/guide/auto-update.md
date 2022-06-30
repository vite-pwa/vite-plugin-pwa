---
title: Automatic reload | Guide
---

# Automatic reload

With this behavior, once the browser detects a new version of your application, then, it will update the caches and will reload any browser windows/tabs with the application opened automatically to take the control.

The disadvantage of using this behavior is that the user can lose data in any browser windows/tabs in which the application is open and is filling in a form.

If your application has forms, we recommend you to change the behavior to use default `prompt` option to allow the user decide when to update the content of the application.

::: danger
Before you put your application into production, you need to be sure of the behavior you want for the service worker. Changing the behavior of the service worker from `autoUpdate` to `prompt` can be a pain.
:::

## Plugin Configuration

With this option, the plugin will force `workbox.clientsClaim` and `workbox.skipWaiting` to `true` on the plugin options.

You must add `registerType: 'autoUpdate'` to `vite-plugin-pwa` plugin options in your `vite.config.ts` file:

```ts
VitePWA({
  registerType: 'autoUpdate'
})
```

### Cleanup Outdated Caches

<CleanupOutdatedCaches />

<GenerateSWCleanupOutdatedCaches />

### Generate SW Source Map

<GenerateSWSourceMap />

## Importing Virtual Modules

With this behavior, you **must** import one of the virtual modules exposed by `vite-plugin-pwa` plugin **only** if you need to prompt a dialog to the user when the application is ready to work offline, otherwise you can import or just omit it.

If you don't import one of the virtual modules, the automatic reload will still work.

### Ready To Work Offline

You must include the following code on your `main.ts` or `main.js` file:

```ts
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onOfflineReady() {},
})
```

You will need to show a ready to work offline dialog to the user with an `OK` button inside `onOfflineReady` callback.

When the user clicks the `OK` button, just hide the prompt shown on `onOfflineReady` method.

### SSR/SSG

<SsrSsg />

