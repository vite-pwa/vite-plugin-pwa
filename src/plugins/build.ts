import type { Plugin } from 'vite'
import { injectServiceWorker } from '../html'
import { _generateBundle, _generateSW } from '../api'
import type { PWAPluginContext } from '../context'

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
      if (!ctx.options.disable && ctx.viteConfig.build.ssr && ctx.isSvelteKitPluginPresent())
        await _generateSW(ctx)
    },
    async closeBundle() {
      // we don't build the sw in the client build when SvelteKit plugin present
      if (!ctx.options.disable && !ctx.viteConfig.build.ssr && !ctx.isSvelteKitPluginPresent())
        await _generateSW(ctx)
    },
    async buildEnd(error) {
      if (error)
        throw error
    },
  }
}
