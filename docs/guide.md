---
title: Get Started
sidebar: 'auto'
---
# Get Started

Zero config [PWA](https://developers.google.com/web/progressive-web-apps) solution for [Vite](https://vitejs.dev)

## Installation

Add `vite-plugin-pwa` dependency to your project:

- YARN:
```shell
yarn add -D vite-plugin-pwa
```
- NPM:
```shell
npm i --save-dev vite-plugin-pwa
```
- NPM:
```shell
pnpm i -D vite-plugin-pwa
```

## Setup

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
