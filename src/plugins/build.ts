import type { Plugin } from 'vite'
import { injectServiceWorker } from '../html'
import { _generateBundle, _generateSW } from '../api'
import type { PWAPluginContext } from '../context'

export function BuildPlugin(ctx: PWAPluginContext) {
  const transformIndexHtmlHandler = (html: string) => {
    const { options, useImportRegister } = ctx
    if (options.disable)
      return html

    // if virtual register is requested, do not inject.
    if (options.injectRegister === 'auto')
      options.injectRegister = useImportRegister ? null : 'script'

    return injectServiceWorker(html, options, false)
  }

  return <Plugin>{
    name: 'vite-plugin-pwa:build',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return transformIndexHtmlHandler(html)
      },
      enforce: 'post', // deprecated since Vite 4
      transform(html) { // deprecated since Vite 4
        return transformIndexHtmlHandler(html)
      },
    },
    async generateBundle(_, bundle) {
      const pwaAssetsGenerator = await ctx.pwaAssetsGenerator
      if (pwaAssetsGenerator)
        pwaAssetsGenerator.injectManifestIcons()

      return _generateBundle(ctx, bundle)
    },
    closeBundle: {
      sequential: true,
      order: ctx.userOptions?.integration?.closeBundleOrder,
      async handler() {
        if (!ctx.viteConfig.build.ssr) {
          const pwaAssetsGenerator = await ctx.pwaAssetsGenerator
          if (pwaAssetsGenerator)
            await pwaAssetsGenerator.generate()

          if (!ctx.options.disable)
            await _generateSW(ctx)
        }
      },
    },
    async buildEnd(error) {
      if (error)
        throw error
    },
  }
}
