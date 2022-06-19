---
title: PWA Minimal Requirements | Guide
---

# PWA Minimal Requirements

Previous steps in this guide, are the minimal requirements and configuration to create the [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) and the service worker when you build your application, but you'll need to include more options to meet PWA Minimal Requirements.

Your application **must** meet the PWA Minimal Requirements before deploying it to production or when testing your build on local: for example, when testing your PWA application on local using `LightHouse`.

To make your PWA application installable (one of the requirements), you will need to modify your application entry point, add some minimal entries to your `Web App Manifest`, allow search engines to crawl all your application pages and configure your server properly (only for production, on local you can use `https-localhost` dependency and `node`).

## Entry Point

Your application entry point (usually `index.html`) **must** have the following entries in the `<head>` section:
- mobile viewport configuration
- a title
- a description
- a favicon
- a link for `apple-touch-icon`
- a link for `mask-icon`
- a meta entry for `theme-color`

For example, here a minimal configuration (you must provide all the icons and images):
```html
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>My Awesome App</title>
  <meta name="description" content="My Awesome App description">
  <link rel="icon" href="/favicon.ico">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
  <link rel="mask-icon" href="/mask-icon.svg" color="#FFFFFF">
  <meta name="theme-color" content="#ffffff">
</head>
```

## Web App Manifest

Your application [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) **must** have the following entries:
- a scope: omitted here for simplicity, the `vite-plugin-pwa` plugin will use the `Vite` base option to configure it (default is `/`)
- a name
- a short description
- a description
- a `theme_color`: **must match** the configured one on `Entry Point theme-color`
- an icon with `192x192` size
- an icon with `512x512` size

To configure the [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest), add the `manifest` entry to the `vite-plugin-pwa` plugin options.

Following with the example, here a minimal configuration (you must provide all the icons and images):
```ts
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
  plugins: [
    VitePWA({
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'My Awesome App',
        short_name: 'MyApp',
        description: 'My Awesome App description',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

## Icons / Images

For `manifest` icons entry, you will need to create `pwa-192x192.png`, and `pwa-512x512.png` icons. The icons specified above are the minimum required to meet PWA, that is, icons with `192x192` and `512x512` resolutions (last one duplicated for `purpose: 'any maskable'` if you want to add it, it is not required).

We suggest you to create a svg or png icon (if it is a png icon, with the maximum resolution possible) for your application and use it to generate a favicon package in [Favicon Generator](https://realfavicongenerator.net/).

For `mask-icon` in the entry point, use the svg or the png used to generate the favicon package.

Once generated, download the ZIP and use `android-*` icons for `pwa-*`:
- use `android-chrome-192x192.png` for `pwa-192x192.png`
- use `android-chrome-512x512.png` for `pwa-512x512.png`
- `apple-touch-icon.png` is `apple-touch-icon.png`
- `favicon.ico` is `favicon.ico`

If you want to add the `purpose: 'any maskable'` icon to the Web App Manifest:
```ts
icons: [
  {
    src: 'pwa-192x192.png',
    sizes: '192x192',
    type: 'image/png'
  },
  {
    src: 'pwa-512x512.png',
    sizes: '512x512',
    type: 'image/png'
  },
  {
    src: 'pwa-512x512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'any maskable'
  }
]
```

## Search Engines

You **must** add a `robots.txt` file to allow search engines to crawl all your application pages, just add `robots.txt` to the `public` folder on your application:
```txt
User-agent: *
Allow: /
```

:::warning
`public` folder must be on the root folder of your application, not inside the `src` folder.
:::

## Server Configuration

You can use the server you want, but your server **must**:
- serve `manifest.webmanifest` with `application/manifest+json` mime type
- serve your application over `https`
- redirect from `http` to `https`

You can find more information in the [Deploy](/deployment/) section.
