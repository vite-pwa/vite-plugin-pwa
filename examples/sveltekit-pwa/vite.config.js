import { pwaConfiguration, replaceOptions } from './pwa-configuration.js'
import { sveltekit } from '@sveltejs/kit/vite';
import { ViteSvelteKitPWA } from 'vite-plugin-pwa';
import replace from '@rollup/plugin-replace'

/** @type {import('vite').UserConfig} */
const config = {
  logLevel: pwaConfiguration.mode === 'development' ? 'info' : undefined,
  build: {
    minify: pwaConfiguration.mode === 'development' ? false : undefined,
  },
  plugins: [
    replace(replaceOptions),
    ViteSvelteKitPWA(pwaConfiguration),
    sveltekit()
  ],
};

export default config;
