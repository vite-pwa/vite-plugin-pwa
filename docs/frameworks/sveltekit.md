---
title: SvelteKit | Frameworks
---

# SvelteKit

::: warning
From SvelteKit version `1.0.0-next.359+`, SvelteKit is just another Vite plugin, and latest versions will also require you to update your application to use Vite ^3.1.0 and Node 16.14+.
:::

::: info
For `Type declarations`, `Prompt for update` and `Periodic SW Updates` go to [Svelte](/frameworks/svelte) entry.
:::

::: tip
You should remove all references to [SvelteKit service worker module](https://kit.svelte.dev/docs#modules-$service-worker) to disable it on your application.
:::

## SvelteKit PWA Plugin

`vite-plugin-pwa` provides the new `SvelteKitPWA` plugin that will allow you to use `vite-plugin-pwa` in your SvelteKit applications.

::: warning
Requires Vite ^3.1.0 and Node 16.14+.
:::

You will need to install `SvelteKitPWA` using:
```shell
pnpm add -D @vite-pwa/sveltekit
```

To update your project to use the new `vite-plugin-pwa` for SvelteKit, you only need to change the Vite config file (you don't need oldest `pwa` and `pwa-configuration` modules):
```ts
// vite.config.js / vite-config.ts
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    sveltekit(),
    SvelteKitPWA({/* pwa options */})
  ],
}

export default config
```

## SvelteKit PWA Plugin Options

::: details SvelteKit PWA Plugin options
```ts
import type { VitePWAOptions } from 'vite-plugin-pwa'

export interface KitOptions {
  /**
     * The base path for your application: by default will use the Vite base.
     *
     * @default '/'
     * @see https://kit.svelte.dev/docs/configuration#paths
     * */
  base?: string

  /**
     * @default '.svelte-kit'
     * @see https://kit.svelte.dev/docs/configuration#outdir
     */
  outDir?: string

  /**
     * @see https://github.com/sveltejs/kit/tree/master/packages/adapter-static#fallback
     */
  adapterFallback?: string

  /**
     * @default 'never'
     * @see https://kit.svelte.dev/docs/configuration#trailingslash
     * */
  trailingSlash?: 'never' | 'always' | 'ignore'
}

export interface SvelteKitPWAOptions extends Partial<VitePWAOptions> {
  kit?: KitOptions
}
```
:::

## SvelteKit Pages

If you want your application to work offline, you should ensure you have not set `hydrate: false` on any of your pages since it will prevent injecting JavaScript into the layout for offline support.

### Auto Update

Since SvelteKit uses SSR/SSG, we need to call the `vite-plugin-pwa` virtual module using a dynamic `import`.

The best place to include the virtual call will be in main layout of the application (you should register it in any layout):

::: details src/routes/+layout.svelte
```html
<script>
  import { onMount } from 'svelte'
  import { pwaInfo } from 'virtual:pwa-info'
  
  onMount(async () => {
    if (pwaInfo) {
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
  
  $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ''
</script>

<svelte:head>
    {@html webManifest}
</svelte:head>

<main>
  <slot />
</main>
```
:::

### Prompt for update

Since SvelteKit uses SSR/SSG, we need to add the `ReloadPrompt` component using a dynamic `import`. `vite-plugin-pwa` plugin will only register the service worker on build (check the [Development section](/guide/development)), it is aligned with the current behavior of [SvelteKit service worker module](https://kit.svelte.dev/docs#modules-$service-worker).

The best place to include the `ReloadPrompt` component will be in main layout of the application (you should register it in any layout):

::: details src/routes/+layout.svelte
```html
<script>
  import { onMount } from 'svelte'
  import { pwaInfo } from 'virtual:pwa-info'

  let ReloadPrompt
  onMount(async () => {
    pwaInfo && (ReloadPrompt = (await import('$lib/ReloadPrompt.svelte')).default)
  })

  $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ''  
</script>

<svelte:head>
    {@html webManifest}
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

## SvelteKit Adapters

If you use some feature in your SvelteKit Adapter, you should also configure the PWA plugin properly using the `kit` option:
- [base](https://kit.svelte.dev/docs/configuration#paths)
- [outDir](https://kit.svelte.dev/docs/configuration#outdir)
- [adapterFallback](https://github.com/sveltejs/kit/tree/master/packages/adapter-static#fallback)
- [trailingSlash](https://kit.svelte.dev/docs/configuration#trailingslash)
