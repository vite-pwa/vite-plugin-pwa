---
title: Unregister Service Worker | Guide
---

# Unregister Service Worker

If you want to unregister the service worker from your PWA application, you only need to add `selfDestroying: true` to the plugin configuration.

`vite-plugin-pwa` plugin will create a new special service worker and replace the existing one in your application once deployed in production: it has to be put in the place of the previous broken/unwanted service worker, with the same name.

::: danger
It is **IMPORTANT TO NOT CHANGE ANYTHING** in the plugin configuration, especially **DO NOT CHANGE THE SERVICE WORKER NAME**, just keep the options and the PWA UI components (if included), the plugin will take care of changing the service worker and avoid interacting with the UI if configured.
:::

In a future, if you want to add the PWA again to your application, you only need to remove the `selfDestroying` option or just disable it: `selfDestroying: false`.

## Development

You can also check the `selfDestroying` plugin option in the dev server with development options enabled: check [Development section](/guide/development) for more info.

## Examples

You have in the examples folder the `**-destroy` scripts in their corresponding `package.json`, you can try it on the development server or from the production build.


## Credits

The implementation is based on this GitHub repo [Self-destroying ServiceWorker](https://github.com/NekR/self-destroying-sw), for more info read [Medium: Self-destroying ServiceWorker](https://medium.com/@nekrtemplar/self-destroying-serviceworker-73d62921d717).
