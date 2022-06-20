import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { presetUno } from 'unocss'
import Unocss from 'unocss/vite'
import { VitePWA } from '../dist'
import LayoutSlotFix from './plugins/layout'
import NavbarFix from './plugins/navbar'

export default defineConfig({
  build: {
    // sourcemap: true,
    // minify: false,
    ssrManifest: false,
    manifest: false,
  },
  optimizeDeps: {
    exclude: [
      '@vueuse/core',
    ],
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    // https://github.com/antfu/vite-plugin-components
    Components({
      dirs: [
        '.vitepress/theme/components',
      ],
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],

      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],

      // generate `components.d.ts` for ts support with Volar
      dts: '.vitepress/components.d.ts',
    }),

    // TODO: remove LayoutSlotFix when https://github.com/vuejs/vitepress/issues/760 included
    LayoutSlotFix(),
    NavbarFix(),

    // https://github.com/unocss/unocss
    Unocss({
      presets: [presetUno()],
    }),

    // https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      outDir: '.vitepress/dist',
      registerType: 'prompt',
      includeManifestIcons: false,
      manifest: {
        id: '/',
        name: 'Vite Plugin PWA',
        short_name: 'PWA for Vite',
        description: 'Zero-config PWA for Vite',
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
            src: 'icon_light.svg',
            sizes: '155x155',
            type: 'image/svg',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{css,js,html,svg,png,ico,txt,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
})
