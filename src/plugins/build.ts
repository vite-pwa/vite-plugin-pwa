import type { Plugin } from 'vite'
import { injectServiceWorker } from '../html'
import { _generateBundle, _generateSW } from '../api'
import type { PWAPluginContext } from '../context'
import { VITE_PWA_PLUGIN_NAMES } from '../constants'

export function BuildPlugin(enforce: 'pre' | 'post', ctx: PWAPluginContext) {
  return <Plugin>{
    name: VITE_PWA_PLUGIN_NAMES.BUILD,
    enforce,
    apply: 'build',
    transformIndexHtml: {
      enforce: 'post',
      transform(html) {
        const { options, useImportRegister } = ctx
        if (options.disable || enforce === 'pre')
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
    async closeBundle() {
      if (!ctx.options.disable && !ctx.viteConfig.build.ssr) {
        if (ctx.hasSvelteKitPlugin() && enforce === 'post')
          throw new Error('Use ViteSvelteKitPWA instead VitePWA in your Vite config file: import { ViteSvelteKitPWA } from \'vite-plugin-pwa\'')

        if (!ctx.hasSvelteKitPlugin() && enforce === 'pre')
          throw new Error('Use VitePWA instead ViteSvelteKitPWA in your Vite config file: import { VitePWA } from \'vite-plugin-pwa\'')

        await _generateSW(ctx)
      }
    },
    async buildEnd(error) {
      if (error)
        throw error
    },
  }
}
