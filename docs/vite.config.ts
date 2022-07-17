import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { presetAttributify, presetUno } from 'unocss'
import Unocss from 'unocss/vite'
import { VitePWA } from '../dist'
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

    NavbarFix(),

    // https://github.com/unocss/unocss
    Unocss({
      theme: {
        breakpoints: {
          'xs': '468px',
          'sm': '640px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1280px',
          '2xl': '1536px',
        },
      },
      shortcuts: [
        { 'pb-input': 'grid grid-cols-[130px_1fr] gap-x-1rem items-baseline lt-sm:grid-cols-[1fr]' },
        { 'pb-error': 'animate-shake-x animate-count-1 animate-delay-0.5s animate-duration-1s' },
        { 'pb-input-enter': 'animate-zoom-in animate-count-1 animate-duration-0.5s' },
        { 'pb-input-leave': 'animate-zoom-out animate-count-1 animate-duration-0.3s' },
        { 'pb-errors-enter': 'animate-zoom-in animate-count-1 animate-duration-0.5s' },
        { 'pb-errors-leave': 'animate-zoom-out animate-count-1 animate-duration-0.3s' },
      ],
      presets: [
        presetUno(),
        presetAttributify(),
      ],
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
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'jsdelivr-images-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7, // <== 7 days
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
