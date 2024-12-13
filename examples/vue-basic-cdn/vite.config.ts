import type { UserConfig } from 'vite'
import process from 'node:process'
import replace from '@rollup/plugin-replace'
import Vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

const config: UserConfig = {
  base: 'https://cdn.com/',
  build: {
    sourcemap: process.env.SOURCE_MAP === 'true',
  },
  plugins: [
    Vue(),
    VitePWA({
      mode: 'development',
    }),
    replace({
      __DATE__: new Date().toISOString(),
    }),
  ],
}

export default config
