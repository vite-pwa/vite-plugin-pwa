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
    async writeBundle() {
      // add support for new SvelteKit Vite Plugin
      const {
        options: {
          disable,
          svelteKitVitePluginOptions: {
            prerenderTimeout = 0,
            disabled = false,
          },
        },
        viteConfig,
      } = ctx

      const sveltekitPresent = disabled || disable || !viteConfig.build.ssr
        ? undefined
        : ctx.viteConfig.plugins.find(p => p.name === 'vite-plugin-svelte-kit')

      if (sveltekitPresent) {
        if (prerenderTimeout > 0)
          await new Promise(resolve => setTimeout(resolve, prerenderTimeout))

        await _generateSW(ctx)
      }
    },
    generateBundle(_, bundle) {
      return _generateBundle(ctx, bundle)
    },
    async closeBundle() {
      if (!ctx.viteConfig.build.ssr && !ctx.options.disable)
        await _generateSW(ctx)
    },
    async buildEnd(error) {
      if (error)
        throw error
    },
  }
}
