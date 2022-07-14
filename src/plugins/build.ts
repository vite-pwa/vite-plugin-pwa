import type { Plugin } from 'vite'
import { injectServiceWorker } from '../html'
import { _generateBundle, _generateSW } from '../api'
import type { PWAPluginContext } from '../context'
import { VITE_PWA_PLUGIN_NAMES } from '../constants'

export function BuildPlugin(ctx: PWAPluginContext) {
  return <Plugin>{
    name: VITE_PWA_PLUGIN_NAMES.build,
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
    async closeBundle() {
      if (!ctx.options.disable && !ctx.viteConfig.build.ssr)
        await _generateSW(ctx)
    },
    async buildEnd(error) {
      if (error)
        throw error
    },
  }
}
