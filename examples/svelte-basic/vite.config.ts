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
    }),
  ],
}

export default config
