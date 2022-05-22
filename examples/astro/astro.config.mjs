import { defineConfig } from 'astro/config';
import {
	astroDontCacheBustURLsMatching as dontCacheBustURLsMatching,
	astroIntegration,
	VitePWA,
} from 'vite-plugin-pwa';
import replace from '@rollup/plugin-replace';
import crypto  from 'crypto';
import fs from 'fs'
import { resolve as resolveFs } from 'path'

const pwaOptions = {
	mode: 'development',
	base: '/',
	registerType: 'autoUpdate',
	includeAssets: ['favicon.svg'],
	manifest: {
		name: 'PWA Router',
		short_name: 'PWA Router',
		theme_color: '#ffffff',
		icons: [
			{
				src: 'pwa-192x192.png', // <== don't add slash, for testing
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/pwa-512x512.png', // <== don't remove slash, for testing
				sizes: '512x512',
				type: 'image/png',
			},
			{
				src: 'pwa-512x512.png', // <== don't add slash, for testing
				sizes: '512x512',
				type: 'image/png',
				purpose: 'any maskable',
			},
		],
	},
	workbox: {
		dontCacheBustURLsMatching,
	},
	devOptions: {
		enabled: process.env.SW_DEV === 'true',
		/* when using generateSW the PWA plugin will switch to classic */
		type: 'module',
		navigateFallback: 'index.html',
	},
}

const replaceOptions = {
	__DATE__: `${new Date().toISOString()}`,
	include: [/\.(ts|astro)$/],
}

const reload = process.env.RELOAD_SW === 'true'

if (process.env.SW === 'true') {
	pwaOptions.srcDir = 'src'
	pwaOptions.filename = 'claims-sw.ts'
	pwaOptions.strategies = 'injectManifest'
	pwaOptions.manifest.name = 'PWA Inject Manifest'
	pwaOptions.manifest.short_name = 'PWA Inject'
}

if (reload) {
	// @ts-ignore
	replaceOptions.__RELOAD_SW__ = 'true'
}

// https://astro.build/config
export default defineConfig({
	integrations: [astroIntegration()],
	vite: {
		build: {
			sourcemap: process.env.SOURCE_MAP === 'true',
		},
		plugins: [
			VitePWA(pwaOptions),
			replace(replaceOptions),
		],
	},
});
