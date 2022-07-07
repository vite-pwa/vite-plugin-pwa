import { resolveConfig } from 'vite'
import replace from '@rollup/plugin-replace'
import { VitePWA } from 'vite-plugin-pwa'
import { copyFileSync } from 'fs'
import minimist from 'minimist'
import fg from 'fast-glob'

const args = minimist(process.argv.slice(2))

process.env.CLAIMS = `${args['CLAIMS'] === 'true'}`
process.env.RELOAD_SW = `${args['RELOAD_SW'] === 'true'}`
process.env.SW = `${args['SW'] === 'true'}`

const webmanifestDestinations = [
	'./.svelte-kit/output/client/_app',
	'./build/_app',
]

const swDestinations = [
	'./.svelte-kit/output/client',
]

const buildPwa = async() => {
	const { pwaConfiguration, replaceOptions } = await import('./pwa-configuration.js')
	// disable manifest generation here
	pwaConfiguration.manifest = false
	const config = await resolveConfig({
			plugins: [
				VitePWA(pwaConfiguration),
				replace(replaceOptions),
			]
		},
		'build',
		'production'
	)
	// when `vite-plugin-pwa` is presented, use it to regenerate SW after rendering
	const pwaPlugin = config.plugins.find(i => i.name === 'vite-plugin-pwa')?.api
	if (pwaPlugin?.generateSW) {
		console.log('Generating PWA...')
		await pwaPlugin.generateSW()
		webmanifestDestinations.forEach(d => {
			copyFileSync('./.svelte-kit/output/client/_app/immutable/manifest.webmanifest', `${d}/manifest.webmanifest`)
		})
		// don't copy workbox, svelte kit will copy it
		if (pwaConfiguration.strategies === 'injectManifest') {
			const name = pwaConfiguration.registerType === 'autoUpdate' ? 'claims-sw.js' : 'prompt-sw.js'
			swDestinations.forEach(d => {
				copyFileSync(`./build/${name}`, `${d}/${name}`)
			})
		} else {
			const entries = await fg(
				['sw.js', 'workbox-*.js'], {
					cwd: './build',
					onlyFiles: true,
					unique: true,
				},
			)
			swDestinations.forEach(d => {
				entries.forEach(s => {
					copyFileSync(`./build/${s}`, `${d}/${s}`)
				})
			})
		}
		console.log('Generation of PWA complete')
	}
}

buildPwa()
