import { pwaConfiguration, replaceOptions } from './pwa-configuration.js'
import { sveltekit } from '@sveltejs/kit/vite';
import { VitePWA } from 'vite-plugin-pwa';
import replace from '@rollup/plugin-replace'

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    replace({ __DATE__: new Date().toISOString(), __RELOAD_SW__: 'false' }),
    sveltekit(),
    VitePWA(pwaConfiguration),
    replace(replaceOptions)
  ],
};

export default config;
