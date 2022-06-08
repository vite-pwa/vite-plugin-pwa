When the user installs the new version of the application, we will have on the service worker cache all new assets and also the old ones. To delete old assets (from previous versions that are no longer necessary), you have to configure an option on the `workbox` entry of the plugin configuration.

When using the `generateSW` strategy, it is not necessary to activate it, the plugin will activate it by default.

We strongly recommend you to **NOT** deactivate the option. If you are curious, you can deactivate it using this code on your plugin configuration:

```ts
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
  plugins: [
    VitePWA({
      workbox: {
        cleanupOutdatedCaches: false
      }
    })
  ]
})
```
