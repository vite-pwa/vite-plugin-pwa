---
title: Getting Started | Guide
---

# Getting Started

`Vite Plugin PWA` uses [Workbox](https://developers.google.com/web/tools/workbox) <outbound-link /> library to build the service worker,
you can find more information on [Workbox](/workbox/) section.


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
export const defineConfig({
  plugins: [
    VitePWA({})
  ]    
})
```

## Features

<ul aria-labelledby="features">
<md-list-anchor href="/guide/generate.html">
  <template #link>Generate Service Worker</template>
  <template #trailing>&#160;with Offline support</template>
</md-list-anchor>
<md-list-anchor href="https://developer.mozilla.org/en-US/docs/Web/Manifest" external>
  <template #heading>Auto inject&#160;</template>
  <template #link>Web App manifests</template>
  <template #trailing>&#160;</template>
</md-list-anchor>
<md-list-anchor href="/guide/prompt-for-update.html">
  <template #link>Prompt for update</template>
  <template #trailing>: prompt for new content refreshing</template>
</md-list-anchor>
<md-list-anchor href="/guide/auto-update.html">
  <template #link>Automatic reload</template>
  <template #trailing>&#160;when new content available</template>
</md-list-anchor>
<md-list-anchor href="/guide/auto-update.html">
  <template #link>Advanced (injectManifest)</template>
  <template #trailing>&#160;with Offline support</template>
</md-list-anchor>
<md-list-anchor href="/guide/static-assets.html">
  <template #link>Static assets handling</template>
</md-list-anchor>
<md-list-anchor href="/guide/periodic-sw-updates.html">
  <template #link>Periodic SW updates</template>
</md-list-anchor>
<md-list-anchor href="/guide/faq.html">
  <template #link>FAQ</template>
</md-list-anchor>
</ul>


