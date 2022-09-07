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
    closeBundle: {
      sequential: true,
      order: ctx.userOptions?.integration?.closeBundleOrder,
      async handler() {
        if (!ctx.viteConfig.build.ssr && !ctx.options.disable)
          await _generateSW(ctx)
      },
    },
    async buildEnd(error) {
      if (error)
        throw error
    },
  }
}
