---
title: Register Service Worker | Guide
---

# Register Service Worker

`vite-plugin-pwa` plugin will register the service worker automatically for you, using the `injectRegister` configuration option (**optional**).

If you want to configure the `injectRegister` plugin option:
```ts
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
  plugins: [
    VitePWA({
      injectRegister: 'auto'
    })
  ]
})
```

The `injectRegister` plugin configuration option, will control how to register the service worker in your application:
- `inline`: injects a simple register script, inlined in the application entry point
- `script`: injects a `script` tag in the `head` with the `service worker` to a generated simple register
- `null` (manual): do nothing, you will need to register the service worker yourself, or import any of the virtual modules exposed by the plugin
- **`auto` (default value)**: depends on whether you use any of the virtual modules exposed by the plugin, it will do nothing or switch to `script` mode


You can find more information about the virtual modules exposed by the plugin in the [Frameworks](/frameworks/) section.

## Inline Registration

When configuring `injectRegister: 'inline'` in the plugin configuration, the plugin will inline a head script adding in to your application entry point:
::: details **inlined head script**
```html
<head>
  <script>
    if('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
      })
    }
  </script>
</head>
```
:::

## Script Registration

When configuring `injectRegister: 'script'` in the plugin configuration, the plugin will generate a `registerSW.js` script adding it to your application entry point:
::: details **head script**
```html
<head>
  <script src="/registerSW.js"></script>
</head>
```
:::

::: details **/registerSW.js**
```js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
  })
}
```
:::

## Manual Registration

When configuring `injectRegister: null` in the plugin configuration, the plugin will do nothing, you must register the service workbox manually yourself.

Or you can import any of the virtual modules exposed by the plugin.

## Auto Registration

If your application code base is not importing any of the virtual modules exposed by the plugin, the plugin will fallback to [Script Registration](/guide/register-service-worker#script-registration), otherwise, the imported virtual module will register the service worker for you.
