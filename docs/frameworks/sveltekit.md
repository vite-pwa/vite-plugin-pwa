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

`Sveltkit` maintainers have been working hard to align `Vite` and `SvelteKit`, right now almost **99%** aligned:
- `SvelteKit` exposes `publicDir` to allow `Vite` plugins using it: `publicDir` is configured with `config.kit.files.assets` (defaults to `static` folder).
- `SvelteKit` exposes `outDir` to allow `Vite` plugins using it: `outDir` configured with `${svelteKitOutDir}/output/client` (defaults to `.svelte-kit/output/client` folder).

`vite-plugin-pwa` exposes a new `Vite` plugin to configure the plugin with `SvelteKit` defaults (you can still use the original `vite-plugin-pwa`, but you will need to configure it properly: check [SvelteKit Support](/frameworks/sveltekit#sveltekit-support).

You can check the default configuration options included by the `vite-plugin-pwa` plugin in the [SvelteKit PWA configuration module](https://github.com/antfu/vite-plugin-pwa/tree/main/src/integrations/sveltekit/config.ts).

To update your project to use the new `vite-plugin-pwa` for `SvelteKit`, you only need to change the `Vite` config file (you don't need oldest `pwa` and `pwa-configuration` modules):
```ts
// vite.config.js
// import { VitePWA } from 'vite-plugin-pwa';          <== replace this import
import { ViteSvelteKitPWA } from 'vite-plugin-pwa'; // <== with this one
import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    sveltekit(),
    ViteSvelteKitPWA({/* options */})
  ],
};

export default config;
```

## SvelteKit Support

Although the `SvelteKit` maintainers have been working hard, there is still one last problem that needs to be resolved: `SvelteKit` uses `process.exit` in the `closeBundle` hook, which means that any `Vite` plugin that is configured after the `SvelteKit` plugin will not be called.

You can check the original issue at `SvelteKit` repo: [Prerender in subprocess](https://github.com/sveltejs/kit/issues/5306).

Since the `vite-plugin-pwa` `BuildPlugin` has `enforce: 'post'`, `Vite` will set it after the `SvelteKit` plugin (it doesn't matter if you set it before or after the ` SvelteKit` in `Vite` plugins array).

To solve this problem, `vite-plugin-pwa` has created a new internal `SvelteKitAdapterPlugin` plugin, basically to make the execution of the `closeBundle` hook of the `vite-plugin-pwa` `BuildPlugin` and the `SvelteKit` plugin sequential.

`SvelteKitAdapterPlugin` will intercept the `closeBundle` hook on both plugins, sleep for 1 second, call `closeBundle` on `BuildPlugin`, and finally call `closeBundle` on `SvelteKit`.
::: danger
That's why you will need to use `ViteSvelteKitPWA` instead `VitePWA`.

When `SvelteKit` fix the issue, we'll remove the internal `SvelteKitAdapterPlugin` plugin and the `ViteSvelteKitPWA` export, and so you will need to update your `Vite` configuration file to use `VitePWA` export.
:::

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

## Prompt for update

Since `SvelteKit` uses `SSR / SSG`, we need to add the `ReloadPrompt` component using `dynamic import`. `vite-plugin-pwa` plugin will only register the service worker on build, it is aligned with the current behavior of [SvelteKit service worker module](https://kit.svelte.dev/docs#modules-$service-worker).

The best place to include the `ReloadPrompt` component will be in main layout of the application (you should register it in any layout):

::: details src/routes/__layout.svelte
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

