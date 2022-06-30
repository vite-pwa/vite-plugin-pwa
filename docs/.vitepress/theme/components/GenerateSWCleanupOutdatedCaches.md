When the browser detects and installs the new version of your application, it will have in the cache storage all new assets and also the old ones. To delete old assets (from previous versions that are no longer necessary), you have to configure an option in the `workbox` entry of the plugin configuration.

When using the `generateSW` strategy, it is not necessary to configure it, the plugin will activate it by default.

We strongly recommend you to **NOT** deactivate the option. If you are curious, you can deactivate it using the following code in your plugin configuration:

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
