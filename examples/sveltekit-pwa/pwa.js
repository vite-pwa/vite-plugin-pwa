import { resolveConfig } from 'vite'
import replace from '@rollup/plugin-replace'
import { VitePWA } from 'vite-plugin-pwa'
import { copyFileSync } from 'fs'
import minimist from 'minimist'

const args = minimist(process.argv.slice(2))

process.env.CLAIMS = `${args['CLAIMS'] === 'true'}`
process.env.RELOAD_SW = `${args['RELOAD_SW'] === 'true'}`
process.env.SW = `${args['SW'] === 'true'}`

const webmanifestDestinations = [
	'./.svelte-kit/output/client/',
	'./build/',
]

const swDestinations = [
	'./build/',
]

const buildPwa = async() => {
	const { pwaConfiguration, replaceOptions } = await import('./pwa-configuration.js')
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
			const destName = pwaConfiguration.registerType === 'autoUpdate' ? 'claims-sw.js' : 'prompt-sw.js'
			const name = `./.svelte-kit/output/client/${destName}`
			swDestinations.forEach(d => {
				copyFileSync(name, `${d}/${destName}`)
			})
		} else {
			swDestinations.forEach(d => {
				copyFileSync('./.svelte-kit/output/client/sw.js', `${d}/sw.js`)
			})
		}
		console.log('Generation of PWA complete')
	}
}

buildPwa()
