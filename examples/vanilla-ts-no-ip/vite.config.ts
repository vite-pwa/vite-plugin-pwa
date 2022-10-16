import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  logLevel: 'info',
  define: {
    __DATE__: `'${new Date().toISOString()}'`,
  },
  build: {
    sourcemap: process.env.SOURCE_MAP === 'true',
  },
  plugins: [
    VitePWA({
      mode: 'development',
      base: '/',
      strategies: 'injectManifest',
      registerType: process.env.CLAIMS === 'true' ? 'autoUpdate' : 'prompt',
      includeAssets: ['favicon.svg'],
      filename: process.env.CLAIMS === 'true' ? 'claims-sw.ts' : 'prompt-sw.ts',
      srcDir: 'src',
      manifest: {
        name: 'PWA Router',
        short_name: 'PWA Router',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png', // <== don't add slash, for testing
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png', // <== don't remove slash, for testing
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png', // <== don't add slash, for testing
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      injectManifest: {
        injectionPoint: undefined,
      },
      devOptions: {
        enabled: process.env.SW_DEV === 'true',
        type: 'module',
        /* when using generateSW the PWA plugin will switch to classic */
        navigateFallback: 'index.html',
      },
    }),
  ],
})
