import { defineConfig } from 'vite'
import type { PWAAssetsOptions } from 'vite-plugin-pwa'
import { VitePWA } from 'vite-plugin-pwa'

const pwaAssets: PWAAssetsOptions = process.env.INLINE_PWA_ASSETS
  ? {
      image: process.env.PNG ? 'public/source-test.png' : 'public/favicon.svg',
    }
  : {
      config: true,
      overrideManifestIcons: true,
    }

export default defineConfig({
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
      /* buildBase: '/test-build-base/', */
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Vite PWA',
        short_name: 'Vite PWA',
        theme_color: '#ffffff',
      },
      pwaAssets,
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
      devOptions: {
        enabled: true,
        suppressWarnings: true,
        type: 'module',
      },
    }),
  ],
})
