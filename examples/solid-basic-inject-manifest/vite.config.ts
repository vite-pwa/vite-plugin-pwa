import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { VitePWA } from 'vite-plugin-pwa'
import replace from '@rollup/plugin-replace'

export default defineConfig({
  build: {
    sourcemap: process.env.SOURCE_MAP === 'true',
    target: 'esnext',
    polyfillDynamicImport: false,
  },
  plugins: [
    solidPlugin(),
    VitePWA({
      mode: 'development',
      srcDir: 'src',
      filename: 'sw.ts',
      base: '/',
      strategies: 'injectManifest',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'PWA Inject Manifest',
        short_name: 'PWA Inject',
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
    }),
    replace({
      __DATE__: new Date().toISOString(),
    }),
  ],
})
