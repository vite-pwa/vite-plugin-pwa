---
title: Getting Started | Guide
---

# Getting Started

If you are new to **Progressive Web Apps (PWA)**, we suggest read this guide before starting writing code: [Learn PWA](https://web.dev/learn/pwa/).

::: tip [Learn PWA](https://web.dev/learn/pwa/)
Progressive Web Apps (PWAs) are web application built and enhanced with modern APIs to deliver enhanced capabilities, reliability, and installability while reaching anyone, anywhere, on any device, all with a single codebase.

If you want to build a Progressive Web App, you may be wondering where to start, if it's possible to upgrade a website to a PWA without starting from scratch, or how to move from a platform-specific app to a PWA.
:::

A PWA mainly consists of a [Web App manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest), a service worker and a script/module to register it in the browser.

`vite-plugin-pwa` will help you to add PWA capabilities, with almost zero configuration, to your existing applications, using the plugin configuration options (it will add sensible built-in default configuration for common use cases):
- generate the [Web App manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- configure the [Web App manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) on your application entry point
- generate the service worker
- generate the script to register the service worker in the browser

## Installing vite-plugin-pwa

To install the `vite-plugin-pwa` plugin, just add it to your project as a `dev dependency`:

With **YARN**:
```shell
yarn add vite-plugin-pwa -D
```

With **NPM**:
```shell
npm i vite-plugin-pwa -D
```

With **PNPM**:
```shell
pnpm i vite-plugin-pwa -D
```

## Configuring vite-plugin-pwa

Edit your `vite.config.js / vite.config.ts` file and add the `vite-plugin-pwa`:

```ts
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
  plugins: [
    VitePWA({})
  ]
})
```

At this point, if you build your application, the [Web App manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) will be generated and configured on the application entry point, the service worker will be also generated and the script/module to register it in the browser added.

::: info
`vite-plugin-pwa` uses [Workbox](https://developers.google.com/web/tools/workbox) library to build the service worker, you can find more information on [Workbox](/workbox/) section.
:::

[//]: # (## Installation)

[//]: # ()
[//]: # (Add `vite-plugin-pwa` dependency to your project as a `dev dependency`:)

[//]: # ()
[//]: # (With **YARN**:)

[//]: # (```shell)

[//]: # (yarn add vite-plugin-pwa -D)

[//]: # (```)

[//]: # ()
[//]: # (With **NPM**:)

[//]: # (```shell)

[//]: # (npm i vite-plugin-pwa -D)

[//]: # (```)

[//]: # ()
[//]: # (With **PNPM**:)

[//]: # (```shell)

[//]: # (pnpm i vite-plugin-pwa -D)

[//]: # (```)

[//]: # ()
[//]: # (## Setup)

[//]: # ()
[//]: # (Edit your `vite.config.ts` file to add `Vite Plugin PWA`:)

[//]: # ()
[//]: # (```ts)

[//]: # (import { VitePWA } from 'vite-plugin-pwa')

[//]: # (export default defineConfig&#40;{)

[//]: # (  plugins: [)

[//]: # (    VitePWA&#40;{}&#41;)

[//]: # (  ])

[//]: # (}&#41;)

[//]: # (```)

## Features

- [Web App manifests](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Generate Service Worker](/guide/generate) with Offline support
- [Prompt for update](/guide/prompt-for-update): prompt for new content refreshing
- [Automatic reload](/guide/auto-update) when new content available
- [Advanced (injectManifest)](/guide/auto-update) with Offline support
- [Static assets handling](/guide/static-assets)
- [Periodic SW updates](/guide/periodic-sw-updates)
- [FAQ](/guide/faq)



