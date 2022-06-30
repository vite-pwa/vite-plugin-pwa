Since plugin version `0.11.2`, your service worker's source map will not be generated as it uses the `build.sourcemap` option from the Vite config, which by default is `false`.

Your service worker source map will be generated when Vite's `build.sourcemap` configuration option has the value `true`,  `'online'` or `'hidden'`, and you have not configured the `workbox.sourcemap` option in the plugin configuration.  If you configure the `workbox.sourcemap` option, the plugin will not change that value.

If you want to generate the source map of your service worker, you can use this code:

```ts
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
  plugins: [
    VitePWA({
      workbox: {
        sourcemap: true
      }
    })
  ]
})
```
