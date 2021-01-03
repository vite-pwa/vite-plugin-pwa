import { UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

const config: UserConfig = {
  plugins: [
    Vue(),
    VitePWA(),
  ],
}

export default config
