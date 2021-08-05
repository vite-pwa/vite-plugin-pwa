# injectManifest

You must read [Which Mode to Use](https://developers.google.com/web/tools/workbox/modules/workbox-build#which_mode_to_use) <outbound-link />
before decide using this strategy on `vite-plugin-pwa` plugin.

Before writing your custom service worker, check if `workbox` can generate the code for you using `generateWS` strategy,
looking for some plugin on `workbox` site on [Runtime Caching Entry](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.RuntimeCachingEntry) <outbound-link />.

You can find the documentation for this method on `workbox` site: [injectManifest](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.injectManifest) <outbound-link />

## Server push notifications

You can use this code on your custom service worker (`src/sw.ts`) to enable `Server Push Notifications`:

> You also need to add the logic to interact from the client logic: [Advanced (injectManifest)](/guide/inject-manifest.html).

```ts
function getEndpoint() {
  return self.registration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription) {
      return subscription.endpoint
    }

    throw new Error('User not subscribed')
  });
}

// Register event listener for the ‘push’ event.
self.addEventListener('push', function(event) {
  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    getEndpoint()
    .then(function(endpoint) {
      // Retrieve the textual payload from the server using a GET request. We are using the endpoint as an unique ID 
      // of the user for simplicity.
      return fetch('./getPayload?endpoint=' + endpoint)
    })
    .then(function(response) {
      return response.text()
    })
    .then(function(payload) {
      // Show a notification with title ‘ServiceWorker Cookbook’ and use the payload as the body.
      self.registration.showNotification('ServiceWorker Cookbook', {
        body: payload
      });
    })
  );
})
```
