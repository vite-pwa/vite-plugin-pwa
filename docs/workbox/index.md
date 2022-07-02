---
title: Getting Started | Workbox
prev:
  text: Apache Http Server 2.4+ | Deployment
  link: /deployment/apache
---

# Getting Started

[**Workbox**](https://developers.google.com/web/tools/workbox/) is a massive package with many modules to make service worker development more enjoyable and remove the need to deal with the low-level service worker API.

In this document, we focus only on the [workbox-build](https://developer.chrome.com/docs/workbox/reference/workbox-build/) module from **Workbox**.

## workbox-build module

This module is for build process purposes (a `node` module); that is, `Vite Plugin PWA` will use it to build your service-worker.

We focus on 2 methods of this module:
- [generateSW](/workbox/generate-sw): for generating the service worker.
- [injectManifest](/workbox/inject-manifest): for when you need more control over your service worker.

You should read [Which Mode to Use](https://developer.chrome.com/docs/workbox/modules/workbox-build/#which-mode-to-use) before deciding which strategy to use.

In short, the `generateSW` function abstracts away the need to work directly with the service worker API when building the service worker. This method can be configured using plugins instead of writing your own service worker code (`generateSW` will generate the code for you).

While the `injectManifest` method will use your existing service worker and build/compile it.

## How is `workbox-build` related to `vite-plugin-pwa`?

`vite-plugin-pwa` uses `generateSW` and `injectManifest` `workbox` methods internally when the `strategies` option is set to `generateSW` and `injectManifest` respectively.

When you configure `strategies: 'generateSW'` option (the default value) in your `vite.config.*` file, the plugin invokes workbox' `generateSW` method. The options passed to the `workbox-build` method will be those provided via the `workbox` option of the plugin configuration.

When you configure `strategies: with the 'injectManifest'` option, the plugin will first build your custom service worker via `rollup`. With the build result, vite-plugin-pwa will call Workbox' `injectManifest` method passing those options provided via the `workbox` option of the plugin configuration.
