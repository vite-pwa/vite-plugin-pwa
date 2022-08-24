---
title: VitePress | Frameworks
---

# VitePress

Since [VitePress](https://vitepress.vuejs.org/) is built using [Vuejs 3](https://v3.vuejs.org/) and 
on top of [Vite](https://vitejs.dev/), the integration with this plugin is graceful.

## VitePress 1.0.0-alpha.5+

::: warning
Using `VitePress 1.0.0-alpha.5+` will require `Vite 3+`.
:::

The latest version of `VitePress` includes a `buildEnd` hook that will allow us to configure the PWA plugin directly in the `VitePress config.ts` module.

PWA plugin provides `VitePress` integration via `VitePressPWA`, which will provide the PWA plugin itself and the `VitePress buildEnd` hook.

You will need to import `VitePressPWA` instead `VitePWA` from `vite-pwa-plugin`:
```ts
import { VitePressPWA } from 'vite-pwa-plugin'
```

then, in `VitePress` configuration module, use `VitePressPWA` to get `VitePWAPlugin` and the `VitePress buildEnd` hook:
``` ts
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { VitePressPWA } from 'vite-pwa-plugin'
const { VitePWAPlugin, buildEnd } = VitePressPWA({
  // pwa options
})

export default defineConfig({
  // VitePress options
  ...
  vite: {
    plugins: [
      // @ts-expect-error Vite 2 types in Vite 3
      VitePWAPlugin
    ]
  },
  buildEnd
})
```

If you need to add some other process to the `VitePress buildEnd` hook, like `optimizing pages` or `generating the sitemap`, you can include them with a custom `VitePress buildEnd` hook (make sure to always run the PWA `buildEnd` hook last):
``` ts
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { VitePressPWA } from 'vite-pwa-plugin'
const optimizePages = async () => {
  // some logic
}

const siteMap = async (siteConfig: any) => {
  // generate site map
}

const { VitePWAPlugin, buildEnd: pwaBuildEnd } = VitePressPWA({
  // pwa options
})

export default defineConfig({
  // VitePress options
  ...
  vite: {
    plugins: [
      // @ts-expect-error Vite 2 types in Vite 3
      VitePWAPlugin
    ]
  },
  async buildEnd(siteConfig: any) {
    await optimizePages()
    await siteMap(siteConfig)
    await pwaBuildEnd()
  }
})
```

or you can configure your logic using the `integrationHook` PWA plugin option (pwa regeneration will always run after the `integrationHook`):

``` ts
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { VitePressPWA } from 'vite-pwa-plugin'

const optimizePages = async () => {
  // some logic
}

const siteMap = async (siteConfig: any) => {
  // generate site map
}

const { VitePWAPlugin, buildEnd } = VitePressPWA({
  // pwa options
  async integrationHook(siteConfig: any) {
    await optimizePages()
    await siteMap(siteConfig)
  }
})

export default defineConfig({
  // VitePress options
  ...
  vite: {
    plugins: [
      // @ts-expect-error Vite 2 types in Vite 3
      VitePWAPlugin
    ]
  },
  buildEnd
})
```

## Old VitePress

Just follow the [Getting Started](/guide/) section and use one of the `registerType` option to configure
the behavior:

- [Prompt for update](/guide/prompt-for-update): prompt for new content refreshing
- [Automatic reload](/guide/auto-update) when new content available

### Import Virtual Modules

You need to configure a `custom theme` and use the `Layout` component to register the `ReloadPrompt.vue` component
when using `prompt for new content available`, see [Vue 3](/frameworks/vue#vue-3).

You should include the `ReloadPrompt.vue` on `.vitepress/theme/components/` directory.

You can also integrate [Periodic SW updates](/guide/periodic-sw-updates).

### Build

Since `VitePress` will generate the pages at the end of the build process, you will need to regenerate the Service 
Worker of your application when the build process finish (the Service Worker will not have the pages on its precache).

Take a look at build `VitePress` site [docs:build script v0.12.3](https://github.com/antfu/vite-plugin-pwa/blob/v0.12.3/docs/package.json#L7).

### Vite Plugin PWA Docs Site

You can go to [Vite Plugin PWA v0.12.3](https://github.com/antfu/vite-plugin-pwa/tree/v0.12.3/docs) to see the 
source code for this site and how it is configured using `VitePress`.
