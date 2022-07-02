import type { Plugin } from 'vite'
import { injectServiceWorker } from '../html'
import type { ExtendManifestEntriesHook, VitePluginPWAAPI } from '../types'
import type { PWAPluginContextResolver } from '../context'
import { _generateBundle, _generateSW } from '../api'

export function BuildPlugin(contextResolver: PWAPluginContextResolver) {
  return <Plugin>{
    name: 'vite-plugin-pwa',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml: {
      enforce: 'post',
      transform(html) {
        const { options, useImportRegister } = contextResolver()
        if (options.disable)
          return html

        // if virtual register is requested, do not inject.
        if (options.injectRegister === 'auto')
          options.injectRegister = useImportRegister ? null : 'script'

        return injectServiceWorker(html, options, false)
      },
    },
    generateBundle(_, bundle) {
      return _generateBundle(contextResolver(), bundle)
    },
    async closeBundle() {
      const ctx = contextResolver()
      if (!ctx.viteConfig.build.ssr && !ctx.options.disable)
        await _generateSW(ctx)
    },
    async buildEnd(error) {
      if (error)
        throw error
    },
    api: <VitePluginPWAAPI>{
      get disabled() {
        const ctx = contextResolver()
        return ctx?.options?.disable
      },
      generateBundle(bundle) {
        return _generateBundle(contextResolver(), bundle!)
      },
      async generateSW() {
        return await _generateSW(contextResolver())
      },
      extendManifestEntries(fn: ExtendManifestEntriesHook) {
        const { options } = contextResolver()
        if (options.disable)
          return

        const configField = options.strategies === 'generateSW' ? 'workbox' : 'injectManifest'
        const result = fn(options[configField].additionalManifestEntries || [])

        if (result != null)
          options[configField].additionalManifestEntries = result
      },
    },
  }
}
