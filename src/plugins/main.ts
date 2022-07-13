import type { Plugin } from 'vite'
import { VIRTUAL_MODULES, VIRTUAL_MODULES_MAP, VIRTUAL_MODULES_RESOLVE_PREFIX } from '../constants'
import { generateRegisterSW } from '../modules'
import { resolveOptions } from '../options'
import { createAPI } from '../api'
import type { PWAPluginContext } from '../context'
import { swDevOptions } from './dev'

export function MainPlugin(ctx: PWAPluginContext): Plugin {
  return {
    name: 'vite-plugin-pwa',
    enforce: 'pre',
    async configResolved(config) {
      ctx.useImportRegister = false
      ctx.viteConfig = config
      // add support for new SvelteKit Vite Plugin.
      // SvelteKit Plugin will not be included in SSR build,
      // we need this global to detect the plugin on client build.
      if (!ctx.userOptions.disable && !config.build.ssr) {
        ctx.lookupSvelteKitPluginPresent()
      }
      else if (!ctx.userOptions.disable && config.build.ssr && ctx.isSvelteKitPluginPresent()) {
        // Vite generates <name>.<hash>.<ext> layout while SvelteKit generates <name>-<hash>.<ext>
        // Vite and SvelteKit are not aligned: pwa plugin will use /\.[a-f0-9]{8}\./ by default: #164 optimize workbox work
        // All assets will go to the immutable folder, and so, there is no need to calculate its revision for the sw's precache manifest
        if (ctx.userOptions.strategies === 'injectManifest') {
          ctx.userOptions.injectManifest = ctx.userOptions.injectManifest ?? {}
          if (!ctx.userOptions.injectManifest.dontCacheBustURLsMatching)
            ctx.userOptions.injectManifest.dontCacheBustURLsMatching = /-[a-f0-9]{8}\./
        }
        else {
          ctx.userOptions.workbox = ctx.userOptions.workbox ?? {}
          if (!ctx.userOptions.workbox.dontCacheBustURLsMatching)
            ctx.userOptions.workbox.dontCacheBustURLsMatching = /-[a-f0-9]{8}\./
        }
      }
      ctx.options = await resolveOptions(ctx.userOptions, config)
    },
    resolveId(id) {
      return VIRTUAL_MODULES.includes(id) ? VIRTUAL_MODULES_RESOLVE_PREFIX + id : undefined
    },
    load(id) {
      if (id.startsWith(VIRTUAL_MODULES_RESOLVE_PREFIX))
        id = id.slice(VIRTUAL_MODULES_RESOLVE_PREFIX.length)
      else
        return

      if (VIRTUAL_MODULES.includes(id)) {
        ctx.useImportRegister = true
        if (ctx.viteConfig.command === 'serve' && ctx.options.devOptions.enabled) {
          return generateRegisterSW(
            { ...ctx.options, filename: swDevOptions.swUrl },
            'build',
            VIRTUAL_MODULES_MAP[id],
          )
        }
        else {
          return generateRegisterSW(
            ctx.options,
            !ctx.options.disable && ctx.viteConfig.command === 'build' ? 'build' : 'dev',
            VIRTUAL_MODULES_MAP[id],
          )
        }
      }
    },
    api: createAPI(ctx),
  }
}
