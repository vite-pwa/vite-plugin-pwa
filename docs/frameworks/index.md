# Vite 

## Virtual Module

This plugin is Framework-agnostic and so you can use it with Vanilla Javascript, Typescript and with any framework.

The only official framework supported and provided by this plugin is `vuejs 3` and `vuejs 2` via `mixin`.

## Usage

This plugin exposes a `Vite` virtual module to interact with the service worker, you must import this virtual module 
when you need to work with [Prompt for update](/guide/prompt-for-update.html) on new content available, since the 
virtual module will expose the methods to interact with the service worker:

```ts
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    // show a prompt to user
  },
  onOfflineReady() {
    // show a ready to work offline to user
  }
})
```

You must also import the virtual module when you need to work with [Automatic reload](/guide/auto-update.html) when new
content available, and you need to notify the user the application is ready to work `offline`:

```ts
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onOfflineReady() {
    // show a ready to work offline to user
  }
})
```

## Frameworks

- [Vuejs](/frameworks/vue)
- [React](/frameworks/react)
- [Svelte](/frameworks/svelte)
- [Vitepress](/frameworks/vitepress)
