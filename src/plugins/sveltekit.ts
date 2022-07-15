import type { Plugin } from 'vite'
import { VITE_PLUGIN_SVELTE_KIT_NAME, VITE_PWA_PLUGIN_NAMES } from '../constants'
import type { PWAPluginContext } from '../context'

export function SvelteKitAdapterPlugin(ctx: PWAPluginContext): Plugin {
  let activateWriteBundle = false
  let activateCloseBundle = false

  const plugins: Plugin[] = []

  const pluginNames: string[] = [
    VITE_PWA_PLUGIN_NAMES.BUILD,
    VITE_PLUGIN_SVELTE_KIT_NAME,
  ]

  function changeToSequentialPlugin(plugin: Plugin) {
    if (!plugin.name || !pluginNames.includes(plugin.name))
      return

    const { writeBundle: _writeBundle, closeBundle: _closeBundle } = plugin
    if (!_writeBundle && !_closeBundle)
      return

    if (_writeBundle) {
      plugin.writeBundle = async (...args) => {
        // since we are replacing the writeBundle for client build, on SSR just ignore the activation
        if (activateWriteBundle || !ctx.viteConfig.build.ssr) {
          // @ts-expect-error ignore the type annotation about any
          await _writeBundle.apply(this, args)
        }
      }
    }

    if (_closeBundle) {
      plugin.closeBundle = async () => {
        // since we are replacing the writeBundle for client build, on SSR just ignore the activation
        if (activateCloseBundle || !ctx.viteConfig.build.ssr) {
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
      // @ts-expect-error I know what I'm doing
      config.plugins?.flat(Infinity).forEach(changeToSequentialPlugin)
    },
    async writeBundle(options, bundle) {
      // this plugin will only work on client build
      if (ctx.viteConfig.build.ssr)
        return

      const svelteKitPlugin = plugins.find(p => VITE_PLUGIN_SVELTE_KIT_NAME === p.name)
      const pwaPlugin = plugins.find(p => VITE_PWA_PLUGIN_NAMES.BUILD === p.name)!

      // give some time to finish writeBundle hooks: dummy calls since it is not yet activated
      await new Promise(resolve => setTimeout(resolve, 1000))
      activateWriteBundle = true
      // @ts-expect-error I know what I'm doing
      await svelteKitPlugin?.writeBundle.apply(this, [options, bundle])
      // activate the closeBundle hooks
      activateCloseBundle = true
      // @ts-expect-error I know what I'm doing
      await pwaPlugin.closeBundle.apply(this, [options, bundle])
      // @ts-expect-error I know what I'm doing
      await svelteKitPlugin?.closeBundle.apply(this, [options, bundle])
    },
  }
}
