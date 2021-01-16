<p align='center'>
<img src='https://repository-images.githubusercontent.com/290129345/d4bfc300-1866-11eb-8602-e672c9dd0e7d' alt="vite-plugin-pwa - Zero-config PWA for Vite">
</p>

<p align='center'>
<a href='https://www.npmjs.com/package/vite-plugin-pwa'>
<img src='https://img.shields.io/npm/v/vite-plugin-pwa?color=33A6B8&label='>
</a>
</p>

<br>

## Features

- Generate Service Worker with Offline support (via [Workbox](https://developers.google.com/web/tools/workbox))
- Auto inject Web App [Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- Strategies option
- **WIP**: Meta injection
- **WIP**: Icons generation for different dimensions

## Usage

> ℹ️ **Vite 2 is supported from `v0.3.x`, Vite 1's support is discontinued.**

```bash
npm i vite-plugin-pwa -D # yarn add vite-plugin-pwa -D
```

Add it to `vite.config.js`

```ts
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    VitePWA()
  ]
}
```

## Configuration

### Simple (generateSW)

```ts
VitePWA({
  manifest: {
    // content of manifest
  },
  workbox: {
    // workbox options for generateSW
  }
})
```

### Advanced (injectManifest)

```js
// sw.js
import { precacheAndRoute } from 'workbox-precaching'
// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)
```

```ts
// vite.config.js
VitePWA({
  strategies: 'injectManifest',
  manifest: {
    // content of manifest
  },
  injectManifest: {
    // workbox options for injectManifest
  }
})
```

### Full config

Check out the type declaration [src/types.ts](./src/types.ts) and the following links for more details.

- [Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Workbox](https://developers.google.com/web/tools/workbox)

## Sponsors

This project is part of my <a href='https://github.com/antfu-sponsors'>Sponsor Program</a>

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'/>
  </a>
</p>

## License

MIT License © 2020 [Anthony Fu](https://github.com/antfu)
