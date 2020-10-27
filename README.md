<h2 align='center'><samp>vite-plugin-pwa</samp></h2>

<p align='center'>PWA for Vite <sup>(alpha)</sup></p>

<p align='center'>
<a href='https://www.npmjs.com/package/vite-plugin-pwa'>
<img src='https://img.shields.io/npm/v/vite-plugin-pwa?color=222&style=flat-square'>
</a>
</p>

<br>

## Features

- Generate Service Worker with Offline support (via [Workbox](https://developers.google.com/web/tools/workbox))
- Auto inject Web App [Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- **WIP**: Meta injection
- **WIP**: Icons generation for different dimensions

## Usage

> This plugin requires Vite `>= v1.0.0-rc.8`

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

```ts
VitePWA({
  manifest: {
    // content of manifest
  },
  workbox: {
    // workbox options
  }
})
```

Check out the type declaration [src/index.ts](./src/index.ts) and following links for more details.

- [Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Workbox](https://developers.google.com/web/tools/workbox)

## License

MIT License © 2020 [Anthony Fu](https://github.com/antfu)
