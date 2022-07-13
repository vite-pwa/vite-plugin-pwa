import type { Plugin } from 'vite'
import { injectServiceWorker } from '../html'
import { _generateBundle, _generateSW } from '../api'
import type { PWAPluginContext } from '../context'

// SvelteKit Plugin will not be included in SSR build, we need this global to detect the plugin on client build
let pwaPluginIsSvelteKitPluginPresent = false

export function BuildPlugin(ctx: PWAPluginContext) {
  return <Plugin>{
    name: 'vite-plugin-pwa:build',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml: {
      enforce: 'post',
      transform(html) {
        const { options, useImportRegister } = ctx
        if (options.disable)
          return html

        // if virtual register is requested, do not inject.
        if (options.injectRegister === 'auto')
          options.injectRegister = useImportRegister ? null : 'script'

        return injectServiceWorker(html, options, false)
      },
    },
    generateBundle(_, bundle) {
      return _generateBundle(ctx, bundle)
    },
    async writeBundle() {
      // add support for new SvelteKit Vite Plugin
      if (!ctx.options.disable && !ctx.viteConfig.build.ssr)
        pwaPluginIsSvelteKitPluginPresent = !!ctx.viteConfig.plugins.find(p => p.name === 'vite-plugin-svelte-kit')

      if (ctx.viteConfig.build.ssr && pwaPluginIsSvelteKitPluginPresent)
        await _generateSW(ctx)
    },
    async closeBundle() {
      // we don't build the sw in the client build when SvelteKit plugin present
      if (!ctx.options.disable && !ctx.viteConfig.build.ssr && !pwaPluginIsSvelteKitPluginPresent)
        await _generateSW(ctx)
    },
    async buildEnd(error) {
      if (error)
        throw error
    },
  }
}
