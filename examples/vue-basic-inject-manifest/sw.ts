// @ts-ignore
import { precacheAndRoute } from 'workbox-precaching'
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') { // @ts-ignore
    self.skipWaiting()
  }
})
// self.__WB_MANIFEST is default injection point
// @ts-ignore
precacheAndRoute(self.__WB_MANIFEST)
