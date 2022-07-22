---
title: SvelteKit | Frameworks
---

# SvelteKit

::: warning
From `SvelteKit` version `1.0.0-next.358+`, `SvelteKit` is just another `Vite` plugin, and latest versions will also require you to update your application to use `Vite 3`.
:::

::: info
For `Type declarations`, `Prompt for update` and `Periodic SW Updates` go to [Svelte](/frameworks/svelte) entry.
:::

::: tip
You should remove all references to [SvelteKit service worker module](https://kit.svelte.dev/docs#modules-$service-worker) to disable it on your application.
:::

## SvelteKit Vite Plugin

To update your project to use the new `vite-plugin-pwa` for `SvelteKit`, you only need to change the `Vite` config file (you don't need oldest `pwa` and `pwa-configuration` modules):
```ts
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa';
import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    sveltekit(),
    VitePWA({/* options */})
  ],
};

export default config;
```

## SvelteKit PWA Configuration

`vite-plugin-pwa` has been modified to automatically detect `SvelteKit` plugin: once detected, it will add a set of default configuration options to your `vite-plugin-pwa` options:
- configure the `globDirectory` with `SvelteKit` output folder: `globDirectory: '.svelte-kit/output'`.
- add `.svelte-kit/output/client` and `.svelte-kit/output/prerendered` to the `globPatterns`: `globPatterns: ['prerendered/**/*.html', 'client/**/*.{js,css,ico,png,svg,webp}']`.
- configure default `Rollup` assets naming convention: `dontCacheBustURLsMatching: /-[a-f0-9]{8}\./` (by default, `vite-plugin-pwa` will use `Vite` assets naming convention: `/\.[a-f0-9]{8}\./`).
- generate the service worker only on client build: `includeManifest: 'client-build'`.
- exclude adding manifest icons: `includeManifestIcons: false` (`Vite` will copy all `publicDir` content to the `SvelteKit` output folder before `vite-plugin-pwa` runs and so you will end up with duplicated entries in the service worker's precache manifest).
- allow you to configure `SvelteKit trailingSlash` option: `vite-plugin-pwa` will use it in its internal `Workbox manifestTransform` callback ([SvelteKit trailingslash](https://kit.svelte.dev/docs/configuration#trailingslash)).
- allow you to configure `SvelteKit fallback` adapter option: `vite-plugin-pwa` will configure it in the `workbox.navigateFallback` options, only when using `generateSW` strategy ([adapter-static fallback](https://github.com/sveltejs/kit/tree/master/packages/adapter-static#fallback)).

Some of the above options will be excluded if you already provide them or if you provide options where there may be a conflict between them: you can view the source code of the [SvelteKit PWA configuration module](https://github.com/antfu/vite-plugin-pwa/tree/main/src/integrations/sveltekit/config.ts) to verify that there are no conflicts.

## SvelteKit Pages

If you want your application can work in offline, you should remove `hydrate: false` from all your pages, this will prevent to inject the layout and so will not work in offline.

### Auto Update

Since `SvelteKit` uses `SSR / SSG`, we need to call the `vite-plugin-pwa` virtual module using `dynamic import`.

The best place to include the virtual call will be in main layout of the application (you should register it in any layout):

::: details src/routes/__layout.svelte
```html
<script>
  import { onMount } from 'svelte'
  import { browser, dev } from '$app/env'

  onMount(async () => {
    if (!dev && browser) {
      const { registerSW } = await import('virtual:pwa-register')
      registerSW({
        immediate: true,
        onRegistered(r) {
          // uncomment following code if you want check for updates
          // r && setInterval(() => {
          //    console.log('Checking for sw update')
          //    r.update()
          // }, 20000 /* 20s for testing purposes */)
          console.log(`SW Registered: ${r}`)
        },
        onRegisterError(error) {
          console.log('SW registration error', error)
        }
      })
    }
  })
</script>

<svelte:head>
  {#if (!dev && browser)}
    <link rel="manifest" href="/manifest.webmanifest">
  {/if}
</svelte:head>

<main>
  <slot />
</main>
```
:::

### Prompt for update

Since `SvelteKit` uses `SSR / SSG`, we need to add the `ReloadPrompt` component using `dynamic import`. `vite-plugin-pwa` plugin will only register the service worker on build (check the [Development section](/guide/development)), it is aligned with the current behavior of [SvelteKit service worker module](https://kit.svelte.dev/docs#modules-$service-worker).

The best place to include the `ReloadPrompt` component will be in main layout of the application (you should register it in any layout):

::: details src/routes/__layout.svelte
```html
<script>
  import { onMount } from 'svelte'
  import { browser, dev } from '$app/env'

  let ReloadPrompt
  onMount(async () => {
    !dev && browser && (ReloadPrompt = (await import('$lib/ReloadPrompt.svelte')).default)
  })
</script>

<svelte:head>
  {#if (!dev && browser)}
    <link rel="manifest" href="/manifest.webmanifest">
  {/if}
</svelte:head>

<main>
  <slot />
</main>

{#if ReloadPrompt}
  <svelte:component this={ReloadPrompt} />
{/if}
```
:::

::: details $lib/ReloadPrompt.svelte
```html
<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte'
	const {
		needRefresh,
		updateServiceWorker
	} = useRegisterSW({
		onRegistered(r) {
		// uncomment following code if you want check for updates
		// r && setInterval(() => {
		//    console.log('Checking for sw update')
		//    r.update()
		// }, 20000 /* 20s for testing purposes */)
			console.log(`SW Registered: ${r}`)
		},
		onRegisterError(error) {
			console.log('SW registration error', error)
		},
	})
	const close = () => {
		offlineReady.set(false)
		needRefresh.set(false)
	}
	$: toast = $offlineReady || $needRefresh
</script>

{#if toast}
	<div class="pwa-toast" role="alert">
		<div class="message">
			{#if $offlineReady}
				<span>
					App ready to work offline
				</span>
			{:else}
				<span>
					New content available, click on reload button to update.
				</span>
			{/if}
		</div>
		{#if $needRefresh}
			<button on:click={() => updateServiceWorker(true)}>
				Reload
			</button>
		{/if}
		<button on:click={close}>
			Close
		</button>
	</div>
{/if}

<style>
	.pwa-toast {
		position: fixed;
		right: 0;
		bottom: 0;
		margin: 16px;
		padding: 12px;
		border: 1px solid #8885;
		border-radius: 4px;
		z-index: 2;
		text-align: left;
		box-shadow: 3px 4px 5px 0 #8885;
		background-color: white;
	}
	.pwa-toast .message {
		margin-bottom: 8px;
	}
	.pwa-toast button {
		border: 1px solid #8885;
		outline: none;
		margin-right: 5px;
		border-radius: 2px;
		padding: 3px 10px;
	}
</style>
```
:::

