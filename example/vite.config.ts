import { UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

process.env.NODE_ENV = 'development'

const config: UserConfig = {
  // base: process.env.BASE_URL || 'https://github.com/',
  build: {
    sourcemap: process.env.SOURCE_MAP === 'true',
  },
  plugins: [
    Vue(),
    VitePWA({
      mode: 'development',
      base: '/',
      injectRegister: 'register',
      minify: false,
      workbox: {
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  esbuild: {
    minify: false,
  },
}

export default config
