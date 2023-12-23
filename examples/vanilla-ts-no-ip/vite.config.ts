import process from 'node:process'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const customSW = process.env.SW === 'true'

export default defineConfig({
  mode: 'development',
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
      /* buildBase: '/test-build-base/', */
      strategies: customSW ? 'injectManifest' : 'generateSW',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      filename: customSW ? 'custom-sw.ts' : undefined,
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
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
      injectManifest: {
        injectionPoint: undefined,
      },
      devOptions: {
        enabled: process.env.SW_DEV === 'true',
        type: 'module',
      },
    }),
  ],
})
