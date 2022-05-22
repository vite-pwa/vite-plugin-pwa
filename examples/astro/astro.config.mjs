import { defineConfig } from 'astro/config';
import { VitePWA } from 'vite-plugin-pwa';
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

let pwaPlugin = undefined
let distFolder = 'dist'

const buildManifestEntry = async (url, path) => {
	return new Promise((resolve, reject) => {
		const cHash = crypto.createHash('MD5')
		const stream = fs.createReadStream(resolveFs(distFolder, path))
		stream.on('error', (err) => {
			reject(err)
		})
		stream.on('data', (chunk) => {
			cHash.update(chunk)
		})
		stream.on('end', () => {
			return resolve({
				url,
				revision: `${cHash.digest('hex')}`,
			})
		})
	})
}

// https://astro.build/config
export default defineConfig({
	integrations: [
		{
			name: 'vite-plugin-pwa:astro:hook',
			hooks: {
				'astro:config:done': (options) => {
					const vite = options.config.vite
					distFolder = vite.build.outDir ?? 'dist'
					for (const p of vite.plugins) {
						if (Array.isArray(p)) {
							pwaPlugin = p.find(p1 => p1.name === 'vite-plugin-pwa')
							break
						}
					}
				},
				'astro:build:done': async ({ routes }) => {
					if (routes && pwaPlugin && pwaPlugin.api && !pwaPlugin.api.isDisabled()) {
						console.log(distFolder)
						console.log(routes.map(r => `${r.component.slice(9)}`))
						const addRoutes = await Promise.all(routes.filter(r => r.type === 'page').map(r => {
							let path = r.component.slice(9, r.component.lastIndexOf('.'))
							console.log(path)
							path = path === '/index' ? '/index.html' : (path === r.pathname ? `${path}/index.html` : `${path}/`)
							console.log(`${path} => ${r.pathname}`)
							return buildManifestEntry(r.pathname, path.slice(1))
							// return path
						}))
						pwaPlugin.api.extendManifestEntries((manifestEntries) => {
							manifestEntries.push(...addRoutes)
						})
						await pwaPlugin.api.generateSW()
					}
				},
			},
		}
	],
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
