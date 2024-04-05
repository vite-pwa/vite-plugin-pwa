import { defineConfig } from 'vite'
import type { PWAAssetsOptions } from 'vite-plugin-pwa'
import { VitePWA } from 'vite-plugin-pwa'

const pwaAssets: PWAAssetsOptions = process.env.INLINE_PWA_ASSETS
  ? {
      // disabled: false,
      // config: false,
      /* preset: {
        transparent: {
          sizes: [48, 72, 96, 144, 192, 256, 384, 512], // Comprehensive sizes for various Android devices
          favicons: [
            [16, 'favicon-16x16.png'],
            [32, 'favicon-32x32.png'],
            [48, 'favicon.ico'],
          ],
        },
        maskable: {
          sizes: [192, 512], // Recommended sizes for maskable icons
          padding: 0,
        },
        apple: {
          sizes: [120, 152, 167, 180, 1024], // Covers iPad and iPhone touch icons plus one for the App Store
        },
      }, */
      image: process.env.PNG ? 'public/source-test.png' : 'public/favicon.svg',
      // htmlPreset: '2023',
    }
  : {
      // disabled: false,
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
