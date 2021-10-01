---
title: FAQ | Guide
---

# FAQ

## IDE errors 'Cannot find module' (ts2307)

If your TypeScript build step or IDE complain about not being able to find modules or type definitions on imports, 
add the following to the `compilerOptions.types` array of your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": [
      "vite-plugin-pwa/client"
    ]
  }
}
```

## Service Worker Registration Errors

You can handle Service Worker registration errors if you want to notify the user with following code on your `main.ts` 
or `main.js`:

```ts
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onRegisterError(error) {}
})
```

and then inside `onRegisterError`, just notify the user that there was an error registering the service worker.

## Missing assets from SW precache manifest

If you find any assets are missing from the service worker's precache manifest, you should check if they exceed the
`maximumFileSizeToCacheInBytes`, the default value is **2 MiB**.

You can increase the value to your needs, for example to allow assets up to **3 MiB**:
- when using `generateSW` strategy:
```ts
workbox: {
  maximumFileSizeToCacheInBytes: 3000000
}
```
- when using `injectManifest` strategy:
```ts
injectManifest: {
  maximumFileSizeToCacheInBytes: 3000000
}
```
