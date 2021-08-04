# Get Started

## Overview

`Vite Plugin PWA` uses [Workbox](https://developers.google.com/web/tools/workbox) <outbound-link /> library to build the service worker,
you can find more information on [Workbox](/workbox/) section.


### Installation

Add `vite-plugin-pwa` dependency to your project:

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

### Setup

Edit your `vite.config.ts` file to add `Vite Plugin PWA`:

```ts
import { VitePWA } from 'vite-plugin-pwa'
export const defineConfig({
  plugins: [
    VitePWA({})
  ]    
})
```

### Features

- [Generate Service Worker](/guide/generate.html) with Offline support
- Auto inject [Web App manifests](https://developer.mozilla.org/en-US/docs/Web/Manifest) <outbound-link />
- [Prompt for update](/guide/prompt-for-update.html): prompt for new content refreshing
- [Automatic reload](/guide/auto-update.html) when new content available
- [Advanced (injectManifest)](/guide/inject-manifest.html) with Offline support
- [Static assets handling](/guide/static-assets.html)
- [Periodic SW updates](/guide/periodic-sw-updates.html)
- [SW registration errors](/guide/sw-registration-errors.html)


