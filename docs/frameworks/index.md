---
title: Getting Started | Frameworks
prev: FAQ | Guide
---

# Getting Started

::: tip
If you use the default `registerType` which is `prompt`, and you want to prompt the users to reload, then you could use our framework modules.

But if you:
1. use `autoUpdate`
2. don't like `autoUpdate`, but also don't feel it's necessary to prompt
3. use `injectManifest`

Then, you **don't need** to learn the framework stuff.
:::

This plugin is Framework-agnostic and so you can use it with Vanilla JavaScript, TypeScript and with any framework.

## Type declarations

You can find all the `vite-plugin-pwa` virtual modules declarations in the following [types.ts module](https://github.com/antfu/vite-plugin-pwa/blob/main/client.d.ts).

::: tip
<TypeScriptError2307 />
:::

```ts
declare module 'virtual:pwa-register' {
  export interface RegisterSWOptions {
    immediate?: boolean
    onNeedRefresh?: () => void
    onOfflineReady?: () => void
    /**
     * Called only if `onRegisteredSW` is not provided.
     *
     * @deprecated Use `onRegisteredSW` instead.
     * @param registration The service worker registration if available.
     */
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
    /**
     * Called once the service worker is registered (requires version `0.12.8+`).
     *
     * @param swScriptUrl The service worker script url.
     * @param registration The service worker registration if available.
     */
    onRegisteredSW?: (swScriptUrl: string, registration: ServiceWorkerRegistration | undefined) => void
    onRegisterError?: (error: any) => void
  }

  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>
}
```

## Import Virtual Modules

`vite-plugin-pwa` plugin exposes a `Vite` virtual module to interact with the service worker.

::: tip
You only need to import the virtual modules exposed by `vite-plugin-pwa` plugin when you need to interact with the user, otherwise you don't need to import any of them, that is, when using `registerType: 'prompt'` or when using `registerType: 'autoUpdate'` and you want to inform the user that the application is ready to work offline.
:::

### Auto Update

You must import the virtual module when you configure `registerType: 'autoUpdate'` and you want your application inform the user when the application is ready to work `offline`:

```ts
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onOfflineReady() {}
})
```

You need to show a ready to work offline message to the user with an OK button inside `onOfflineReady` method.

When the user clicks the `OK` button, just hide the prompt shown on `onOfflineReady` method.

### Prompt For Update

When using `registerType: 'prompt'`, you **must** import the virtual module:

```ts
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {}
})
```

You will need to:
- show a prompt to the user with refresh and cancel buttons inside `onNeedRefresh` method.
- show a ready to work offline message to the user with an OK button inside `onOfflineReady` method.

When the user clicks the "refresh" button when `onNeedRefresh` called, then call `updateSW()` function; the page will reload and the up-to-date content will be served.

In any case, when the user clicks the `Cancel` or `OK` buttons in case `onNeedRefresh` or `onOfflineReady` respectively, close the corresponding showed prompt.

## Custom Vite Virtual Modules

`vite-plugin-pwa` plugin also exposes a set of virtual modules for [Vue 3](https://v3.vuejs.org/), [React](https://reactjs.org/), [Svelte](https://svelte.dev/docs), [SolidJS](https://www.solidjs.com/) and [Preact](https://preactjs.com/).  

These custom virtual modules will expose a wrapper for  <code>virtual:pwa-register</code> using framework <code>reactivity system</code>, that is:
- <code>virtual:pwa-register/vue</code>: [ref](https://v3.vuejs.org/api/refs-api.html#ref) for <code>Vue 3</code>
- <code>virtual:pwa-register/react</code>: [useState](https://reactjs.org/docs/hooks-reference.html#usestate) for <code>React</code>
- <code>virtual:pwa-register/svelte</code>: [writable](https://svelte.dev/docs#writable) for <code>Svelte</code>
- <code>virtual:pwa-register/solid</code>: [createSignal](https://www.solidjs.com/docs/latest/api#createsignal) for <code>SolidJS</code>
- <code>virtual:pwa-register/preact</code>: [useState](https://preactjs.com/guide/v10/hooks#usestate) for <code>Preact</code>

**Note**: for [Vue 2](https://vuejs.org/) you need to use a custom `mixin` provided on [Vue 2](/frameworks/vue#vue-2) section.

## Frameworks

These custom virtual modules will expose a wrapper for <code>virtual:pwa-register</code> using framework <code>reactivity system</code>, that is:
- [Vue](/frameworks/vue)
- [React](/frameworks/react)
- [Svelte](/frameworks/svelte)
- [SvelteKit](/frameworks/sveltekit)
- [SolidJS](/frameworks/solidjs)
- [Preact](/frameworks/preact)
- [VitePress](/frameworks/vitepress)
- [îles](/frameworks/iles)
- [Astro](/frameworks/astro)
