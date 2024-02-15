import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  mode: 'development',
  logLevel: 'info',
  define: {
    __DATE__: `'${new Date().toISOString()}'`,
  },
  build: {
    sourcemap: true,
  },
  plugins: [
    VitePWA({
      mode: 'development',
      base: '/',
      strategies: 'injectManifest',
      srcDir: './service-worker',
      filename: 'sw.js',
      includeAssets: ['favicon.svg'],
      injectRegister: false,
      injectManifest: {
        minify: false,
        enableWorkboxModulesLogs: true,
      },
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
      devOptions: {
        enabled: true,
        /* when using generateSW the PWA plugin will switch to classic */
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    }),
  ],
})
