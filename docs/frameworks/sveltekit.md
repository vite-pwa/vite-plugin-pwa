---
title: SvelteKit | Frameworks
---

# SvelteKit

> For `Type declarations`, `Prompt for update` and `Periodic SW Updates` go to [Svelte](/frameworks/svelte.html) entry.
> 

You should remove all references to [SvelteKit service worker module](https://kit.svelte.dev/docs#modules-$service-worker) <outbound-link /> to disable it on your application.

Since `SvelteKit` uses `SSR / SSG`, we need to add the `ReloadPrompt` component using `dynamic import`. `Vite Plugin PWA` will only register the service worker on build, it is aligned with the current behavior of [SvelteKit service worker module](https://kit.svelte.dev/docs#modules-$service-worker) <outbound-link />.

The best place to include the `ReloadPrompt` is on the main layout of the application:

<details>
  <summary><strong>src/routes/__layout.svelte</strong> code</summary>

```html
<script>
	import { onMount } from 'svelte'
	import { browser, dev } from '$app/env'

	let ReloadPrompt
	onMount(async () => {
		!dev && browser && (ReloadPrompt = (await import('$lib/components/ReloadPrompt.svelte')).default)
	})
</script>

<svelte:head>
	{#if (!dev && browser)}
		<link rel="manifest" href="/_app/manifest.webmanifest">
	{/if}
</svelte:head>

<main>
  <slot />
</main>

{#if ReloadPrompt}
	<svelte:component this={ReloadPrompt} />
{/if}
```
</details>

## SvelteKit Adapters

The main problem with the current implementation of the service worker module of `SvelteKit` is that you don't have access to the result applied by any adapter you have configured on your application. The service worker module of `SvelteKit` will be called before the adapter logic is applied, and so, inside the service worker module, you don't have access to those resources. Your application will not work when the user is offline, since the pages will not be included on the service worker precache manifest.

When using `Vite PWA Plugin` with any `SvelteKit Adapter` you need to provide an additional script to rebuild your `pwa` once `SvelteKit` finish building your application, that is, when the adapter configured finish its job.

The biggest difference between this plugin and the SvelteKit service worker module is that this plugin does not require integration into the application logic - just configuration. You can take a look at [SvelteKit example](https://github.com/antfu/vite-plugin-pwa/tree/main/examples/sveltekit-pwa) <outbound-link /> to configure the additional scripts on your application, it is quite complex since we use it for multiple behaviors with the same codebase.

As an example, when using [@sveltejs/adapter-static](https://github.com/sveltejs/kit/tree/master/packages/adapter-static) <outbound-link /> with `generateSW` strategy and `Prompt for update` behavior, you will need:

<details>
<summary>1) add <strong>pwa.js</strong> script</summary>

```js
import { resolveConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';
import { pwaConfiguration } from './pwa-configuration.js';
import { copyFileSync } from 'fs';

const webmanifestDestinations = [
	'./.svelte-kit/output/client/',
	'./build/',
]

const swDestinations = [
	'./build/',
]

const buildPwa = async() => {
	const config = await resolveConfig({ plugins: [VitePWA({ ...pwaConfiguration })] }, 'build', 'production' )
	// when `vite-plugin-pwa` is present, use it to regenerate SW after rendering
	const pwaPlugin = config.plugins.find(i => i.name === 'vite-plugin-pwa')?.api
	if (pwaPlugin?.generateSW) {
		console.log('Generating PWA...')
		await pwaPlugin.generateSW()
		webmanifestDestinations.forEach(d => {
			copyFileSync('./.svelte-kit/output/client/_app/manifest.webmanifest', `${d}/manifest.webmanifest`)
		})
		// don't copy workbox, SvelteKit will copy it
		swDestinations.forEach(d => {
			copyFileSync('./.svelte-kit/output/client/sw.js', `${d}/sw.js`)
		})
		console.log('Generation of PWA complete')
	}
} 

buildPwa()
```
</details>


<details>
<summary>2) add <strong>pwa-configuration.js</strong> script</summary>

```js
const pwaConfiguration = {
	srcDir: './build',
	outDir: './.svelte-kit/output/client',
	includeManifestIcons: false,
	base: '/',
	scope: '/',
	manifest: {
	short_name: "<YOUR APP SHORT NAME>",
	name: "<YOUR APP NAME>",
	scope: "/",
	start_url: "/",
	display: "standalone",
	theme_color: "#ffffff",
	background_color: "#ffffff",
	icons: [
		{
			src: "/pwa-192x192.png",
			sizes: "192x192",
			type: "image/png"
		},
		{
			src: "/pwa-512x512.png",
			"sizes": "512x512",
			"type": "image/png"
		},
		{
			src: "/pwa-512x512.png",
			"sizes": "512x512",
			"type": "image/png",
			purpose: 'any maskable'
		}
	]
	},
	workbox: {
		// mode: 'development',
		navigateFallback: '/',
		// vite and SvelteKit are not aligned: pwa plugin will use /\.[a-f0-9]{8}\./ by default: #164 optimize workbox work
		dontCacheBustURLsMatching: /-[a-f0-9]{8}\./,
		globDirectory: './build/',
		globPatterns: ['robots.txt', '**/*.{js,css,html,ico,png,svg,webmanifest}'],
		globIgnores: ['**/sw*', '**/workbox-*'],
		// Before generating the service worker, manifestTransforms entry will allow us to transform the resulting precache manifest.
		// The entries received in the callback from workbox-build module, will contain all the assets specified on srcDir option with the url and its corresponding revision calculated (hash).
		// Since SvelteKit uses the router name of the directory for all the generated pages, we add a callback to modify the url for all pages.
		manifestTransforms: [async(entries) => {
			// manifest.webmanifest is added always by pwa plugin, so we remove it.
			// EXCLUDE from the sw precache sw and workbox-*
			const manifest = entries.filter(({ url }) =>
				url !== 'manifest.webmanifest' && url !== 'sw.js' && !url.startsWith('workbox-')
			).map((e) => {
				let url = e.url;
				if (url && url.endsWith('.html')) {
					if (url.startsWith('/'))
						url = url.slice(1)
					
					e.url = url === 'index.html' ? '/' : `/${url.substring(0, url.lastIndexOf('/'))}`
				}
				
				return e
			});
			
			return { manifest };
		}]
	}
};

export { pwaConfiguration };
```
</details>

<details>
<summary>3) modify your <strong>build</strong> script</summary>

```json
"scripts": {
	"build": "svelte-kit build && node ./pwa.js"
}
```
</details>


<details>
<summary>4) add <strong>Vite Plugin PWA</strong> to <strong>svelte.config.js</strong></summary>

```js
import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import { VitePWA } from 'vite-plugin-pwa';
import { pwaConfiguration } from './pwa-configuration.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			plugins: [VitePWA(pwaConfiguration)]
		}
	}
};

export default config;
```
</details>
