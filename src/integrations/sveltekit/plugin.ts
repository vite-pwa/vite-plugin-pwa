import type { Plugin } from 'vite'
import { VITE_PLUGIN_SVELTE_KIT_NAME, VITE_PWA_PLUGIN_NAMES } from '../../constants'
import type { PWAPluginContext } from '../../context'

export function SvelteKitAdapterPlugin(ctx: PWAPluginContext): Plugin {
  let activateCloseBundle = false

  const plugins: Plugin[] = []

  const pluginNames: string[] = [
    VITE_PWA_PLUGIN_NAMES.BUILD,
    VITE_PLUGIN_SVELTE_KIT_NAME,
  ]

  function changeToSequentialPlugin(plugin: Plugin) {
    if (!plugin.name || !pluginNames.includes(plugin.name))
      return

    const { closeBundle: _closeBundle } = plugin

    if (_closeBundle) {
      plugin.closeBundle = async () => {
        // since we are replacing the closeBundle for client build, on SSR just ignore the activation
        if (ctx.options.disable || activateCloseBundle || ctx.viteConfig.build.ssr) {
          // @ts-expect-error ignore the type annotation about any
          await _closeBundle.apply(this)
        }
      }
    }
    plugins.push(plugin)
  }
  return {
    name: 'vite-plugin-pwa:svelte-kit-adapter',
    enforce: 'post',
    apply: (config, env) => {
      // this plugin will only work on client build
      return env.command === 'build'
    },
    config(config) {
      // @ts-expect-error TypeScript doesn't handle flattening Vite's plugin type properly
      config.plugins?.flat(Infinity).forEach(changeToSequentialPlugin)
    },
    async closeBundle() {
      // this plugin will only work on client build
      if (ctx.options.disable || ctx.viteConfig.build.ssr)
        return

      const svelteKitPlugin = plugins.find(p => VITE_PLUGIN_SVELTE_KIT_NAME === p.name)
      const pwaPlugin = plugins.find(p => VITE_PWA_PLUGIN_NAMES.BUILD === p.name)

      // give some time to finish writeBundle hooks: dummy calls, not yet activated
      await new Promise(resolve => setTimeout(resolve, 1000))
      // activate the closeBundle hooks
      activateCloseBundle = true
      await pwaPlugin!.closeBundle!.apply(this)
      await svelteKitPlugin?.closeBundle?.apply(this)
    },
  }
}
