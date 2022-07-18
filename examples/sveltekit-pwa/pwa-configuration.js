const mode = process.env.SOURCE_MAP === 'true' ? 'development': undefined

/** @type {import('vite-plugin-pwa').VitePWAOptions} */
const pwaConfiguration = {
	mode,
	includeManifestIcons: false,
	scope: '/',
	base: '/',
	selfDestroying: process.env.SW_DESTROY === 'true',
	// manifestFilename: '/_app/manifest.webmanifest',
	manifest: {
		short_name: 'PWA Router',
		name: 'PWA Router',
		start_url: '/',
		scope: '/',
		display: 'standalone',
		theme_color: '#ffffff',
		background_color:' "#ffffff"',
		icons: [
			{
				src: '/pwa-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/pwa-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},
			{
				src: '/pwa-512x512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'any maskable',
			},
		]
	},
	svelteKitVitePluginOptions: {
		globClientPatterns: ['client/**/*.{js,css,ico,png,svg}', 'prerendered/**/*.html'],
	},
	devOptions: {
		enabled: process.env.SW_DEV === 'true',
		/* when using generateSW the PWA plugin will switch to classic */
		type: 'module',
		navigateFallback: '/',
	},
}

const claims = process.env.CLAIMS === 'true'
const reload = process.env.RELOAD_SW === 'true'
const sw = process.env.SW === 'true'
const replaceOptions = {
	__DATE__: new Date().toISOString(),
	__RELOAD_SW__: reload ? 'true' : 'false',
	__SW_DEV__: process.env.SW_DEV === 'true' ? 'true' : 'false',
}

if (sw) {
	pwaConfiguration.srcDir = 'src'
	pwaConfiguration.filename = claims ? 'claims-sw.ts' : 'prompt-sw.ts'
	pwaConfiguration.strategies = 'injectManifest'
	pwaConfiguration.manifest.name = 'PWA Inject Manifest'
	pwaConfiguration.manifest.short_name = 'PWA Inject'
}

if (claims)
	pwaConfiguration.registerType = 'autoUpdate'

export { pwaConfiguration, replaceOptions }
