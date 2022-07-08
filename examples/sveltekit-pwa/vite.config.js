import { pwaConfiguration, replaceOptions } from './pwa-configuration.js'
import { sveltekit } from '@sveltejs/kit/vite';
import { VitePWA } from 'vite-plugin-pwa';
import replace from '@rollup/plugin-replace'

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    sveltekit(),
    VitePWA(pwaConfiguration),
    replace(replaceOptions)
  ],
};

export default config;
