---
title: Static assets handling | Guide
---

# Static assets handling

By default, all icons on `PWA Manifest` option found under Vite's `publicDir` option directory, will be included
in the service worker *precache*. You can disable this option using `includeManifestIcons: false`.

You can also add another static assets such as `favicon`, `svg` and `font` files using `includeAssets` option.
The `includeAssets` option will be resolved using `fast-glob` found under Vite's `publicDir` option directory, and so
you can use regular expressions to include those assets, for example: `includeAssets: ['fonts/*.ttf', 'images/*.png']`.
You don't need to configure `PWA Manifest icons` on `includeAssets` option.

If you need to include other assets that are not under Vite's `publicDir` option directory, you can use the
`globPatterns` parameter of [workbox](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.generateSW) <outbound-link />
or [injectManifest](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.injectManifest) <outbound-link />
plugin options.

If you use `generateWS` strategy, then you need to configure:

```ts
VitePWA({
  workbox: {
    globPatterns: [],
  } 
})
```

If you use `injectManifest` strategy, then you need to configure:

```ts
VitePWA({
  injectManifest: {
    globPatterns: [],
  }  
})
```


