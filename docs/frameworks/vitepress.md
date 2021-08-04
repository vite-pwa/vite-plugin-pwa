# Vitepress

Since [Vitepress](https://vitepress.vuejs.org/) <outbound-link /> is built using [Vuejs 3](https://v3.vuejs.org/) <outbound-link /> and 
on top of [Vite](https://vitejs.dev/) <outbound-link />, the integration with this plugin is graceful.

## Setup

Just follow the [Generate Service Worker](/guide/generate.html) section and use one of the `registerType` option to configure
the behavior:

- [Prompt for update](/guide/prompt-for-update.html): prompt for new content refreshing
- [Automatic reload](/guide/auto-update.html) when new content available

## Runtime

You need to configure a `custom theme` and use the `Layout` component to register the `ReloadPrompt.vue` component
when using `prompt for new content available`, see [Vue 3](/frameworks/vue.html#vue-3).

You should include the `ReloadPrompt.vue` on `.vitepress/theme/components/` directory.

You can also integrate [Periodic SW updates](/guide/periodic-sw-updates.html).

## Build

Since `Vitepress` will generate the pages at the end of the process, you need to regenerate the Service Worker of
your application when the process finish, since the Service Worker will not have the pages on its precache.

Take a look at build `Vitepress` site [docs:build script](https://github.com/antfu/vite-plugin-pwa/blob/master/docs/package.json#L7) <outbound-link />.

## Vite Plugin PWA Docs Site

You can go to [Vite Plugin PWA](https://github.com/antfu/vite-plugin-pwa/tree/master/docs) <outbound-link /> to see the 
source code for this site and how it is configured using `Vitepress`.
