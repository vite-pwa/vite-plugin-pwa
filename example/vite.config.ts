import { UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

const config: UserConfig = {
  base: process.env.BASE_URL || 'https://github.com/',
  build: {
    sourcemap: process.env.SOURCE_MAP === 'true',
  },
  plugins: [
    Vue(),
    VitePWA({
      mode: 'development',
      base: '/',
      injectRegister: 'register',
      workbox: {
        cleanupOutdatedCaches: true,
      },
    }),
  ],
}

export default config
