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
      /* buildBase: '/test-build-base/', */
      strategies: 'injectManifest',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      filename: 'custom-sw.ts',
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
      },
    }),
  ],
})
