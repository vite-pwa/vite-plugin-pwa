import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import { VitePWA } from 'vite-plugin-pwa';
import replace from '@rollup/plugin-replace'
import { pwaConfiguration, replaceOptions } from './pwa-configuration.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),

		prerender: {
			default: true,
		},

		vite: {
			plugins: [
				VitePWA(pwaConfiguration),
				replace(replaceOptions)
			]
		}
	}
};

export default config;
