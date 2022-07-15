import type { Plugin } from 'vite'
import { VITE_PLUGIN_SVELTE_KIT_NAME, VITE_PWA_PLUGIN_NAMES } from '../../constants'
import type { PWAPluginContext } from '../../context'

export function SvelteKitAdapterPlugin(ctx: PWAPluginContext): Plugin {
  let activeWriteBundle = false
  let activeCloseBundle = false

  const plugins: Plugin[] = []

  const pluginNames: string[] = [
    VITE_PWA_PLUGIN_NAMES.build,
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
        if (activeWriteBundle || !ctx.viteConfig.build.ssr) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          await _writeBundle.apply(this, args)
        }
      }
    }

    if (_closeBundle) {
      plugin.closeBundle = async () => {
        if (activeCloseBundle || !ctx.viteConfig.build.ssr) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
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
      return env.command === 'build'
    },
    config(config) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      config.plugins?.flat(Infinity).forEach(changeToSequentialPlugin)
    },
    async writeBundle(options, bundle) {
      if (ctx.viteConfig.build.ssr || ctx.viteConfig.command === 'serve')
        return

      const svelteKitPlugin = plugins.find(p => VITE_PLUGIN_SVELTE_KIT_NAME === p.name)
      const pwaPlugin = plugins.find(p => VITE_PWA_PLUGIN_NAMES.build === p.name)!

      // give sometime to finish writeBundle hooks: dummy calls since it is not yet activated
      await new Promise(resolve => setTimeout(resolve, 1000))
      activeWriteBundle = true
      // @ts-expect-error I know what I'm doing
      await svelteKitPlugin?.writeBundle.apply(this, [options, bundle])
      // activate the closeBundle hooks
      activeCloseBundle = true
      // @ts-expect-error I know what I'm doing
      await pwaPlugin.closeBundle.apply(this, [options, bundle])
      // @ts-expect-error I know what I'm doing
      await svelteKitPlugin.closeBundle.apply(this, [options, bundle])
    },
  }
}
