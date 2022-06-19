---
title: Getting Started | Frameworks
---

# Getting Started 

This plugin is Framework-agnostic and so you can use it with Vanilla JavaScript, TypeScript and with any framework.

## Type declarations

```ts
declare module 'virtual:pwa-register' {
  export interface RegisterSWOptions {
    immediate?: boolean
    onNeedRefresh?: () => void
    onOfflineReady?: () => void
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
    onRegisterError?: (error: any) => void
  }

  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>
}
```

## Import Virtual Modules

This plugin exposes a `Vite` virtual module to interact with the service worker, you must import this virtual module when you need to work with [Prompt for update](/guide/prompt-for-update) on new content available:

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

You must also import the virtual module when you need to work with [Automatic reload](/guide/auto-update) when new content available, and you need to notify the user the application is ready to work `offline`:

```ts
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onOfflineReady() {}
})
```

You will need to show a ready to work offline message to the user with an OK button inside `onOfflineReady` method.

When the user clicks the `OK` button, just hide the prompt shown on `onOfflineReady` method.

## Custom Vite Virtual Modules

This plugin also exposes a set of virtual modules for [Vue 3](https://v3.vuejs.org/), [React](https://reactjs.org/), [Svelte](https://svelte.dev/docs), [SolidJS](https://www.solidjs.com/) and [Preact](https://preactjs.com/).  

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
