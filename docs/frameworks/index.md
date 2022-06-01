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
    onRegisterError?: (error: unknown) => void
  }

  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>
}
```

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

When the user clicks the `OK` button, just hide the prompt shown on `onOfflineReady` method.

## Custom Vite Virtual Modules

This plugin also exposes a set of virtual modules for [Vue 3](https://v3.vuejs.org/) <outbound-link />,
[React](https://reactjs.org/) <outbound-link />, [Svelte](https://svelte.dev/docs) <outbound-link />, 
[SolidJS](https://www.solidjs.com/) <outbound-link /> and [Preact](https://preactjs.com/) <outbound-link />.  

<p id="virtual-modules-frameworks">These custom virtual modules will expose a wrapper for 
<code>virtual:pwa-register</code> using framework <code>reactivity system</code>, that is:</p>

<ul aria-labelledby="virtual-modules-frameworks">
<md-list-anchor href="https://v3.vuejs.org/api/refs-api.html#ref" :external="true">
  <template #heading><code>virtual:pwa-register/vue</code>:&#160;</template>
  <template #link>ref</template>
  <template #trailing>&#160;for <code>Vue 3</code>.</template>
</md-list-anchor>
<md-list-anchor href="https://reactjs.org/docs/hooks-reference.html#usestate" :external="true">
  <template #heading><code>virtual:pwa-register/react</code>:&#160;</template>
  <template #link>useState</template>
  <template #trailing>&#160;for <code>React</code>.</template>
</md-list-anchor>
<md-list-anchor href="https://svelte.dev/docs#writable" :external="true">
  <template #heading><code>virtual:pwa-register/svelte</code>:&#160;</template>
  <template #link>writable</template>
  <template #trailing>&#160;for <code>Svelte</code>.</template>
</md-list-anchor>
<md-list-anchor href="https://www.solidjs.com/docs/latest/api#createsignal" :external="true">
  <template #heading><code>virtual:pwa-register/solid</code>:&#160;</template>
  <template #link>createSignal</template>
  <template #trailing>&#160;for <code>SolidJS</code>.</template>
</md-list-anchor>
<md-list-anchor href="https://preactjs.com/guide/v10/hooks#usestate" :external="true">
  <template #heading><code>virtual:pwa-register/preact</code>:&#160;</template>
  <template #link>useState</template>
  <template #trailing>&#160;for <code>Preact</code>.</template>
</md-list-anchor>
</ul>

**Note**: for [Vue 2](https://vuejs.org/) <outbound-link /> you need to use a custom `mixin` provided on 
[Vue 2](/frameworks/vue.html#vue-2) section.

## Frameworks

<ul aria-labelledby="frameworks">
<md-list-anchor href="/frameworks/vue.html">
  <template #link>Vue</template>
</md-list-anchor>
<md-list-anchor href="/frameworks/react.html">
  <template #link>React</template>
</md-list-anchor>
<md-list-anchor href="/frameworks/svelte.html">
  <template #link>Svelte</template>
</md-list-anchor>
<md-list-anchor href="/frameworks/sveltekit.html">
  <template #link>SvelteKit</template>
</md-list-anchor>
<md-list-anchor href="/frameworks/solidjs.html">
  <template #link>SolidJS</template>
</md-list-anchor>
<md-list-anchor href="/frameworks/preact.html">
  <template #link>Preact</template>
</md-list-anchor>
<md-list-anchor href="/frameworks/vitepress.html">
  <template #link>VitePress</template>
</md-list-anchor>
</ul>
