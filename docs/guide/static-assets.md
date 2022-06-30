---
title: Static assets handling | Guide
---

# Static assets handling

By default, all icons on `PWA Web App Manifest` option found under `Vite's publicDir` option directory, will be included in the service worker *precache*. You can disable this option using `includeManifestIcons: false`.

You can also add another static assets such as `favicon`, `svg` and `font` files using `includeAssets` option. The `includeAssets` option will be resolved using `fast-glob` found under Vite's `publicDir` option directory, and so you can use regular expressions to include those assets, for example: `includeAssets: ['fonts/*.ttf', 'images/*.png']`. You don't need to configure `PWA Manifest icons` on `includeAssets` option.

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
