# Vite 

## Virtual Module

This plugin is Framework-agnostic and so you can use it with Vanilla Javascript, Typescript and with any framework.

## Usage

This plugin exposes a `Vite` virtual module to interact with the service worker, you must import this virtual module 
when you need to work with [Prompt for update](/guide/prompt-for-update.html) on new content available:

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

When the user clicks the "refresh" button when `onNeedRefresh` called, then call `updateSW()` function; the page will
reload and the up-to-date content will be served.

In any case, when the user clicks the `Cancel` or `OK` buttons in case `onNeedRefresh` or `onOfflineReady` respectively,
close the corresponding showed prompt.

You must also import the virtual module when you need to work with [Automatic reload](/guide/auto-update.html) when new
content available, and you need to notify the user the application is ready to work `offline`:

```ts
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onOfflineReady() {}
})
```

You will need to show a ready to work offline message to the user with an OK button inside `onOfflineReady` method.

When the user click the `OK` button, just hide the prompt shown on `onOfflineReady` method.

## Custom Vite Virtual Modules

This plugin also exposes a set of virtual modules for [Vue 3](https://v3.vuejs.org/) <outbound-link />, 
[Svelte](https://svelte.dev/docs) <outbound-link /> and [React](https://reactjs.org/) <outbound-link />.  

These custom virtual modules will expose a wrapper for `virtual:pwa-register` using framework `reactivity system`, that is:
- `virtual:pwa-register/vue`: [ref](https://v3.vuejs.org/api/refs-api.html#ref) <outbound-link /> for `Vue 3`.
- `virtual:pwa-register/svelte`: [writable](https://svelte.dev/docs#writable) <outbound-link /> for `Svelte`.
- `virtual:pwa-register/react`: [useState](https://reactjs.org/docs/hooks-reference.html#usestate) <outbound-link /> for `React`.

**Note**: for [Vue 2](https://vuejs.org/) <outbound-link /> you need to use a custom `mixin` provided on 
[Vue 2](/frameworks/vue.html#vue-2) section.

## Frameworks

- [Vue](/frameworks/vue)
- [React](/frameworks/react)
- [Svelte](/frameworks/svelte)
- [Vitepress](/frameworks/vitepress)
