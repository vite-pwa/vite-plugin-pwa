const mode = process.env.SOURCE_MAP === 'true' ? 'development': undefined

/** @type {import('vite-plugin-pwa').VitePWAOptions} */
const pwaConfiguration = {
	srcDir: './src',
	outDir: './.svelte-kit/output/client',
	mode,
	includeManifestIcons: false,
	scope: '/',
	base: '/',
	manifest: {
		short_name: "PWA Router",
		name: "PWA Router",
		start_url: "/",
		scope: "/",
		display: "standalone",
		theme_color: "#ffffff",
		background_color: "#ffffff",
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
	devOptions: {
		enabled: process.env.SW_DEV === 'true',
		/* when using generateSW the PWA plugin will switch to classic */
		type: 'module',
		navigateFallback: '/',
		webManifestUrl: '/_app/manifest.webmanifest'
	},
}

const claims = process.env.CLAIMS === 'true'
const reload = process.env.RELOAD_SW === 'true'
const sw = process.env.SW === 'true'
const selfDestroying = process.env.SW_DESTROY === 'true'
const replaceOptions = {
	__DATE__: new Date().toISOString(),
	__RELOAD_SW__: reload ? 'true' : 'false',
	__SW_DEV__: process.env.SW_DEV === 'true' ? 'true' : 'false',
}

const workboxOrInjectManifestEntry = {
	// Vite and SvelteKit are not aligned: pwa plugin will use /\.[a-f0-9]{8}\./ by default: #164 optimize workbox work
	dontCacheBustURLsMatching: /-[a-f0-9]{8}\./,
	modifyURLPrefix: {
		'client/': '/',
		'prerendered/pages/': '/'
	},
	globDirectory: '.svelte-kit/output',
	globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
	// TODO: change this when sequential fixed
	// globPatterns: ['client/**/.{js,css,ico,png,svg,webmanifest}', 'prerendered/pages/**/*.{html}'],
	globIgnores: sw ? (claims ? ['**/claims-sw*'] : ['**/prompt-sw*']) : ['**/sw*', '**/workbox-*'],
	// Before generating the service worker, manifestTransforms entry will allow us to transform the resulting precache manifest. See the manifestTransforms docs for mode details.
	manifestTransforms: [async(entries) => {
		// TODO: remove filter when sequential fixed
		const manifest = entries.filter(({ url }) =>
			!url.endsWith('sw.js') && !url.startsWith('workbox-') && !url.startsWith('server/') && url !== 'manifest.webmanifest'
		).map((e) => {
			let url = e.url
			console.log(url)
			if (url.endsWith('.html')) {
				if (url.startsWith('/'))
					url = url.slice(1)

				e.url = url === 'index.html' ? '/' : `/${url.slice(0, url.lastIndexOf('.'))}`
				console.log(`${url} => ${e.url}`)
			}

			return e
		})
		return { manifest }
	}]
}

if (sw) {
	pwaConfiguration.srcDir = 'src'
	pwaConfiguration.filename = claims ? 'claims-sw.ts' : 'prompt-sw.ts'
	pwaConfiguration.strategies = 'injectManifest'
	pwaConfiguration.manifest.name = 'PWA Inject Manifest'
	pwaConfiguration.manifest.short_name = 'PWA Inject'
	pwaConfiguration.injectManifest = workboxOrInjectManifestEntry
} else {
	workboxOrInjectManifestEntry.mode = mode
	workboxOrInjectManifestEntry.navigateFallback = '/'
	if (process.env.SW_DEV === 'true') {
		// In dev, we only need to intercept the entry point.
		// If not using following regex in allowlist, /about route will not work, since the sw will return / content.
		workboxOrInjectManifestEntry.workbox = {
			navigateFallbackAllowlist: [/^\/$/]
		}
	}
	pwaConfiguration.workbox = workboxOrInjectManifestEntry
}

if (claims)
	pwaConfiguration.registerType = 'autoUpdate'

if (selfDestroying)
	pwaConfiguration.selfDestroying = selfDestroying

export { pwaConfiguration, replaceOptions }
