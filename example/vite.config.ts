import { UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

const config: UserConfig = {
  base: 'https://github.com/',
  plugins: [
    Vue(),
    VitePWA({
      mode: 'development',
    }),
  ],
}

export default config
