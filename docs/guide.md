---
title: Get Started
---
# Get Started

Zero config [PWA](https://developers.google.com/web/progressive-web-apps) solution for [Vite](https://vitejs.dev)

## Installation

Add `vite-plugin-pwa` dependency to your project:

```shell
# YARN
yarn add -D vite-plugin-pwa
```

```shell
# NPM
npm i --save-dev vite-plugin-pwa
```

```shell
# PNPM
pnpm i -D vite-plugin-pwa
```

## Setup

Edit your `vite.config.ts` file to add `Vite Plugin PWA Plugin`:

```ts
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'
export const defineConfig({
  plugins: [
    VitePWA({ /* options*/ })
  ]    
})
```
