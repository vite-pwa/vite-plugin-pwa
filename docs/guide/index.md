---
title: Getting Started | Guide
---

# Getting Started

::: tip [Learn PWA](https://web.dev/learn/pwa/)
Progressive Web Apps (PWAs) are web application built and enhanced with modern APIs to deliver enhanced capabilities, reliability, and installability while reaching anyone, anywhere, on any device, all with a single codebase.

If you want to build a Progressive Web App, you may be wondering where to start, if it's possible to upgrade a website to a PWA without starting from scratch, or how to move from a platform-specific app to a PWA.
:::

A PWA mainly consists of a [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest), a service worker and a script/module to register it in the browser.

`vite-plugin-pwa` will help you to add PWA capabilities, with almost zero configuration, to your existing applications.

Using the `vite-plugin-pwa` configuration, it will add sensible built-in default configuration for common use cases, the plugin will:
- generate the [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- configure the [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) on your application entry point
- generate the service worker
- generate the script to register the service worker in the browser

If you are new to **Progressive Web Apps (PWA)**, we suggest read this guide before starting writing code: [Learn PWA](https://web.dev/learn/pwa/).

## Installing vite-plugin-pwa

To install the `vite-plugin-pwa` plugin, just add it to your project as a `dev dependency`:

With **YARN**:
```shell
yarn add vite-plugin-pwa -D
```

With **NPM**:
```shell
npm i vite-plugin-pwa -D
```

With **PNPM**:
```shell
pnpm i vite-plugin-pwa -D
```

## Configuring vite-plugin-pwa

Edit your `vite.config.js / vite.config.ts` file and add the `vite-plugin-pwa`:

```ts
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
  plugins: [
    VitePWA({ registerType: 'autoUpdate' })
  ]
})
```

At this point, if you build your application, the [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) will be generated and configured on the application entry point, the service worker will be also generated and the script/module to register it in the browser added.

::: info
`vite-plugin-pwa` uses [Workbox](https://developers.google.com/web/tools/workbox) library to build the service worker, you can find more information in the [Workbox](/workbox/) section.
:::

## PWA Minimal Requirements

::: warning
Previous steps are the minimal requirements and configuration to create the [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) and the service worker when you build your application, but you'll need to include a few more things to meet PWA Minimal Requirements.

You **must** meet the PWA Minimal Requirements only when testing your build on local or before deploying to production: for example, when testing your PWA on local using `LightHouse`.
:::

### Entry Point

Your application entry point (usually `index.html`) **must** have the following entries in the `<head>` section:
- mobile viewport configuration
- a title
- a description
- a favicon
- a link for `apple-touch-icon`
- a link for `mask-icon`
- a meta entry for `theme-color`

For example, here a minimal configuration:
```html
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>My Awesome App</title>
  <meta name="description" content="My Awaesome App description">
  <link rel="icon" href="/favicon.ico">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
  <link rel="mask-icon" href="/mask-icon.svg" color="#FFFFFF">
  <meta name="theme-color" content="#ffffff">
</head>
```

### Web App Manifest

Your application [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) **must** have the following entries:
- a scope: omitted here for simplicity, the `vite-plugin-pwa` will use the `Vite` base option to configure it
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
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.png'],
      manifest: {
        name: 'My Awesome App',
        short_name: 'MyApp',
        description: 'My Awaesome App description',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ]
      }
    })
  ]
})
```

### Server Configuration

You can use the server you want, but your server **must**:
- serve `manifest.webmanifest` with mime type `application/manifest+json`
- serve your application over `https`
- redirect from `http` to `https`

You can find mor information in the [Deploy](/deployment/) section.

## Features

- [Web App Manifests](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Generate Service Worker](/guide/generate) with Offline support
- [Prompt for update](/guide/prompt-for-update): prompt for new content refreshing
- [Automatic reload](/guide/auto-update) when new content available
- [Advanced (injectManifest)](/guide/auto-update) with Offline support
- [Static assets handling](/guide/static-assets)
- [Periodic SW updates](/guide/periodic-sw-updates)
- [FAQ](/guide/faq)



