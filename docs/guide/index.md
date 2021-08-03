# Get Started

## Overview

`Vite Plugin PWA` uses [Workbox](https://developers.google.com/web/tools/workbox) <outbound-link /> library to build the service worker,
you can find more information on [Workbox](/workbox/) section.


### Installation

Add `vite-plugin-pwa` dependency to your project:

```shell
# YARN
yarn add vite-plugin-pwa -D
```

```shell
# NPM
npm i vite-plugin-pwa -D
```

```shell
# PNPM
pnpm i vite-plugin-pwa -D
```

### Setup

Edit your `vite.config.ts` file to add `Vite Plugin PWA`:

```ts
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'
export const defineConfig({
  plugins: [
    VitePWA({ /* options*/ })
  ]    
})
```

### Features

- [Generate Service Worker](/guide/generate.html) with Offline support
- Auto inject [Web App manifests](https://developer.mozilla.org/en-US/docs/Web/Manifest) <outbound-link />
- [Prompt for update](/guide/prompt-for-update.html): prompt for new content refreshing
- [Automatic reload](/guide/auto-update.html) when new content available
- [Advanced (injectManifest)](/guide/inject-manifest.html) with Offline support
- [Manual SW updates](/guide/manual-sw-updates.html)
- [Static assets handling](/guide/static-assets.html)


