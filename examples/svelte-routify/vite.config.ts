import { UserConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'
import replace from '@rollup/plugin-replace'

const config: UserConfig = {
  // base: process.env.BASE_URL || 'https://github.com/',
  build: {
    sourcemap: process.env.SOURCE_MAP === 'true',
  },
  plugins: [
    svelte(),
    VitePWA({
      mode: 'development',
      base: '/',
      registerType: process.env.CLAIMS === 'true' ? 'autoUpdate' : undefined,
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
      // https://github.com/sveltejs/kit/issues/587
      workbox:  {
        globPatterns: ['*.*', 'assets/*.*'],
        globIgnores: [
          'sw.js', // <== MUST BE EXCLUDED
          'workbox-*.js', // <== MUST BE EXCLUDED
          'assets/*.map', // <== SHOULD BE EXCLUDED
          'pwa-*.png', // <== INCLUDED BY DEFAULT, JUST AVOID DUPLICATES
          'manifest.webmanifest'// <== INCLUDED BY DEFAULT, JUST AVOID DUPLICATES
        ]
      }
    }),
    replace({
      __DATE__: new Date().toISOString(),
      __RELOAD_SW__: process.env.RELOAD_SW === 'true' ? 'true' : 'false',
    }),
  ],
}

export default config
