import { UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

const config: UserConfig = {
  build: {
    base: 'test'
  },
  plugins: [
    Vue(),
    VitePWA(),
  ],
}

export default config
