import { UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { VitePWA, Options as VitePWAOptions } from 'vite-plugin-pwa'
import replace from '@rollup/plugin-replace'

const pwaConfig: Partial<VitePWAOptions> = {
  mode: 'development',
  base: '/',
}
if (process.env.SW === 'true') {
  pwaConfig.srcDir = ''
  pwaConfig.strategies = 'injectManifest'
  pwaConfig.injectManifest = {
    swSrc: 'sw.ts',
  }
}

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
      srcDir: '',
      strategies: 'injectManifest',
      injectManifest: {
        swSrc: 'sw.ts',
      },
    }),
    replace({
      __DATE__: new Date().toISOString(),
    }),
  ],
}

export default config