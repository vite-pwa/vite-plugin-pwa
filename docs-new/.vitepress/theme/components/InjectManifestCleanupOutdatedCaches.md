When the user installs the new version of the application, we will have on the service worker cache all new assets and also the old ones. To delete old assets (from previous versions that are no longer necessary), and since you are building your own service worker, you will need to add the following code to your custom service worker:

```js
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)
```

We strongly recommend you to include previous code on your custom service worker.
