---
title: Static assets handling | Guide
---

# Static assets handling

By default, all icons on `PWA Web App Manifest` option found under `Vite's publicDir` option directory, will be included in the service worker *precache*. You can disable this option using `includeManifestIcons: false`.

You can also add another static assets such as `favicon`, `svg` and `font` files using `includeAssets` option. The `includeAssets` option will be resolved using `fast-glob` found under Vite's `publicDir` option directory, and so you can use regular expressions to include those assets, for example: `includeAssets: ['fonts/*.ttf', 'images/*.png']`. You don't need to configure `PWA Manifest icons` on `includeAssets` option.

## Reusing src/assets images

If you are using images in your application via `src/assets` directory, and you want to reuse those images in your `PWA Manifest` icons, you can use them with these 2 limitations:
- any image under `src/assets` directory must be used in your application via static import or directly on the `src` attribute
- you must reference the images in the `PWA Manifest` icons using the assets directory path relative to the root folder: `./src/assets/logo.png` or `src/assets/logo.png`

For example, if you have the following image `src/assets/logo-192x192.png` you can add it to your `PWA Manifest` icon using:

```json
{
  "src": "./src/assets/logo-192x192.png", // or src/assets/logo-192x192.png
  "sizes": "192x192",
  "type": "image/png"
}
```

then, in your codebase, you must use it via static import:
```vue
<!-- src/App.vue -->
<script setup>
import logo from './assets/logo-192x192.png'
</script>
<template>
  <img :src="logo" alt="logo" width="192" height="192" />
</template>
```

or using the `src` attribute:

```vue
<!-- src/App.vue -->
<template>
  <img src="./assets/logo-192x192.png" alt="logo" width="192" height="192" />
</template>
```

## globPatterns

If you need to include other assets that are not under Vite's `publicDir` option directory, you can use the `globPatterns` parameter of [workbox](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.generateSW) or [injectManifest](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.injectManifest) plugin options.

::: warning
If you configure `globPatterns` on `workbox` or `injectManifest` plugin option, you **MUST** include all your assets patterns: `globPatterns` will be used by `workbox-build` to match files on `dist` folder.

By default, `globPatterns` will be `**/*.{js,css,html}`: `workbox` will use [glob primer](https://github.com/isaacs/node-glob#glob-primer) to match files using `globPatterns` as filter.

A common pitfall is to only include some assets and forget to add `css`, `js` and `html` assets pattern, and then your service worker will complain about missing resources.

For example, if you don't include `html` assets pattern, you will get this error from your service worker:  **WorkboxError non-precached-url index.html**.
:::

If you use `generateSW` strategy, then you need to configure `globPatterns` inside `workbox` plugin option:

```ts
VitePWA({
  workbox: {
    globPatterns: [],
  }
})
```

If you use `injectManifest` strategy, then you need to configure`globPatterns` inside `injectManifest` plugin option:

```ts
VitePWA({
  injectManifest: {
    globPatterns: [],
  }
})
```
