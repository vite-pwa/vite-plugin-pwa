# Generate Service Worker

Edit your `vite.config.ts` file to add `Vite Plugin PWA Plugin`:

<details open>
  <summary><strong>VitePWA options</strong> code</summary>

```ts
import { VitePWA } from 'vite-plugin-pwa'
export const defineConfig({
  plugins: [
    VitePWA({
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'safari-pinned-tab.svg'],  
      manifest: {
        name: 'Name of your app',
        short_name: 'Short name of your app',
        description: 'Description of your app',
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
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          }
        ]
      }
    })
  ]    
})
```
</details>

You will need to create your `robots.txt`, `favicon.svg` and/or `favicon.ico`, `apple-touch-icon.png`.

You can create `robots.tx` on `public` directory with the following content:
```txt
User-agent: *
Allow: /
```

For `manifest` icons entry, you will need to create `pwa-192x192.png`, and `pwa-512x512.png`. The icons specified above
are the minimum required to meet PWA, that is, icons with `192x192` and `512x512` resolutions (last one duplicate for
`purpose: 'any maskable'`).

We suggest that you create an SVG or PNG icon (if it is a PNG icon, with the maximum resolution possible)  icon for 
your application and use it to generate a favicon package on [Favicon Generator](https://realfavicongenerator.net/) <outbound-link />. 

Once generated, download the ZIP and use
`android-*` icons for `pwa-*`:

- use `android-chrome-192x192.png` for `pwa-192x192.png`
- use `android-chrome-512x512.png` for `pwa-512x512.png`
- `apple-touch-icon.png` is `apple-touch-icon.png`
- `favicon.ico` is `favicon.ico`
- `safari-pinned-tab.svg` is `safari-pinned-tab.svg`

You will also need to change your `index.html` file to include at least the following content to meet PWA requirements,
you must change the `title` and the `description`, `favicon.svg` is the svg you have created:

<details open>
  <summary><strong>index.html</strong> code</summary>

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Your app title</title>
  <meta name="description" content="Your app description">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="alternate icon" href="/favicon.ico" type="image/png" sizes="16x16">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
  <link rel="mask-icon" href="/favicon.svg" color="#FFFFFF">
  <meta name="theme-color" content="#ffffff">
</head>
```
</details>

The `theme-color` in the html and the` theme_color` in the PWA `manifest` entry should match, change it to the color 
you want. 

