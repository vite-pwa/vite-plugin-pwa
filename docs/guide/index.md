---
title: Getting Started | Guide
---

# Getting Started

`Vite Plugin PWA` uses [Workbox](https://developers.google.com/web/tools/workbox) library to build the service worker, you can find more information on [Workbox](/workbox/) section.

If you are new to **Progressive Web Apps (PWA)**, we suggest read this guide before starting writing code (it is still work in progress): [Learn PWA](https://web.dev/learn/pwa/).

## Installation

Add `vite-plugin-pwa` dependency to your project as a `dev dependency`:

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

## Setup

Edit your `vite.config.ts` file to add `Vite Plugin PWA`:

```ts
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
  plugins: [
    VitePWA({})
  ]
})
```

## Features

- [Web App manifests](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Generate Service Worker](/guide/generate) with Offline support
- [Prompt for update](/guide/prompt-for-update): prompt for new content refreshing
- [Automatic reload](/guide/auto-update) when new content available
- [Advanced (injectManifest)](/guide/auto-update) with Offline support
- [Static assets handling](/guide/static-assets)
- [Periodic SW updates](/guide/periodic-sw-updates)
- [FAQ](/guide/faq)



