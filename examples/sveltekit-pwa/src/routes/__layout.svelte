<script>
	import { onMount } from 'svelte'
	import { browser, dev } from '$app/env'

	// replaced dynamically
	const date = '__DATE__'
	const enableSwDev = '__SW_DEV__'

	const enableManifest = (!dev && browser) || (dev && browser && enableSwDev === 'true')

	let ReloadPrompt
	onMount(async () => {
		enableManifest && (ReloadPrompt = (await import('$lib/components/ReloadPrompt.svelte')).default)
	})
</script>

<svelte:head>
	{#if enableManifest}
		<link rel="manifest" href="/_app/manifest.webmanifest">
	{/if}
</svelte:head>

<main>
	<img src="/favicon.svg" alt="PWA Logo" width="60" height="60"/>
	<h1>SvelteKit PWA!</h1>

	<div class="built">Built at: { date }</div>

	<slot />

</main>

{#if ReloadPrompt}
	<svelte:component this={ReloadPrompt} />
{/if}

<style>
	:root {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
		Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	}
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
		}
		h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4rem;
		font-weight: 100;
		line-height: 1.1;
		margin: 2rem auto;
		max-width: 14rem;
	}
	@media (min-width: 480px) {
		h1 {
			max-width: none;
		}
	}
</style>
