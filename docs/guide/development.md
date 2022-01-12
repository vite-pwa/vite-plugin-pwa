---
title: Development | Guide
---

# Development

From version `v0.11.13` you can use the service worker on development.

The PWA will not be registered, only the service worker logic, check the details for each strategy bellow.

> **Warning**: there will be only one single registration on the service worker precache manifest (`self.__WB_MANIFEST`) 
when necessary: `navigateFallback`.

The service worker on development will be only available if `disabled` PWA plugin option is not `true` and the `enable` 
development option is `true`.

## Setup

To enable the service worker on development, you only need to add the following options to the plugin configuration:

```ts
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
  plugins: [
    VitePWA({
      /* other options */
      /* enable sw on development */  
      devOptions: {
        enabled: true
        /* other options */  
      }
    })
  ]    
})
```

## Type declarations

```ts
/**
 * Development options.
 */
export type DevOptions = {
  /**
   * Should the service worker be available on development?.
   *
   * @default false
   */
  enabled?: boolean
  /**
   * The service worker type.
   *
   * @default 'classic'
   */
  type?: WorkerType
  /**
   * This option will enable you to not register the `runtimeConfig` configured on `workbox.runtimeConfig` option on development.
   *
   * **WARNING**: this option will only be used when using `generateSW` strategy.
   *
   * @default false
   */
  disableRuntimeConfig?: boolean
  /**
   * This options will allow you to configure the `registerRoute` when using `registerRoute` for `offline` support:,
   * configure here the corresponding `url`, for example `navigateFallback: 'index.html'`.
   *
   * **WARNING**: this option will only be used when using `injectManifest` strategy.   
   */
  navigateFallback?: string
}
```

## generateSW strategy

When using this strategy, the `navigateFallback` on development options will be ignored. The PWA plugin will check if
`workbox.navigateFallback` is configured and will only register it on `additionalManifestEntries`.

The PWA plugin will force `type: 'classic'` on service worker registration to avoid errors on client side (not yet supported):

```shell
Uncaught (in promise) TypeError: Failed to execute 'importScripts' on 'WorkerGlobalScope': Module scripts don't support importScripts().
```

## injectManifest strategy

You can use `type: 'module'` when registering the service worker (right now only supported on latest versions of `Chromium` based browsers: `Chromium/Chrome/Edge`).

> **Warning**: when building the application, the PWA Plugin will always register your service worker with `type: 'classic'` for compatibility with all browsers.

When using this strategy, the plugin will delegate the service worker compilation to `Vite`, so if you're using `import` 
instead `importScripts` in your custom service worker, you should configure `type: 'module'` on development options.

If you are using `registerRoute` in your custom service worker you should add `navigateFallback` on development options,
the PWA plugin will include it on `self.__WB_MANIFEST`.

You should not use `HMR` on your custom service worker, since we cannot use yet dynamic imports on service workers: `import.meta.hot`.

When you change your service worker, `Vite` will force a full reload, since we're using `workbox-window` to register it 
(by default, you can register it manually) you may have some problems with the service worker events:

<HeuristicWorkboxWindow />

## Example

You can find an example here: [vue-router](https://github.com/antfu/vite-plugin-pwa/tree/main/examples/vue-router).

To run the example, you must build the PWA plugin (`pnpm run build` from root folder), change to `vue-router` directory 
(`cd examples/vue-router`) and run it:
- `generateSW` strategy: `pnpm run dev`
- `injectManifest` strategy: `pnpm run dev-claims`
