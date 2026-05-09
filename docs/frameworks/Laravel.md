---
title: Laravel/Vite | Frameworks
---

# Laravel/Vite

Laravel configures Vite to build assets to the `/public/build` folder. This causes problems for the generated webapp files such as `manifest.webmanifest` and `sw.js`, because the scope (the URL that the PWA is defined as being within) is limited to the location of the manifest file and service worker in most browsers. This would mean your webapp could only be located in http://example.com/build/.

We can get around this by sending an additional header when the client loads the generated `sw.js` file. This allows us to redefine the maximum scope of our web app. For example, using Nginx:
```
location ~* sw\.js$ {
    add_header 'Service-Worker-Allowed' '/';
    try_files $uri = 404;
}
```

Then edit the configuration of this plugin to ensure all referenced URLs are relative to the `public/build` folder and set the scope to '/':
```
VitePWA({
  outDir: 'public/build/',
  buildBase: '/build/',
  scope: '/',
  id: '/',
})
```

We will also make the plugin generate `registerSW.js` file which we can use to register the service worker:
```ts
VitePWA({
  ...
  registerSW: true,
})
```

This generates a `registerSW.js` file which we should include along with the `manifest.webmanifest` file in any page which will be part of the PWA. You can edit the layout file to include:
```
<link rel="manifest" href="/build/manifest.webmanifest">
<script src="/build/registerSW.js"></script>
```

The plugin will by default also try to cache `index.html` by default. Because laravel is dynamically generating it's files using the Blade system we don't have an `index.html` file in the `public` folder. We can let the plugin know not to try and cache this using:
```ts
VitePWA({
  ...
  workbox: {
    navigateFallback: null,
  },
})
```


Then add the manifest and any other configuration as described elsewhere:
```ts
VitePWA({
  ...
  manifest: {
    ...
  }
})
```
