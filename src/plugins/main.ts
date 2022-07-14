import type { Plugin } from 'vite'
import {
  VIRTUAL_MODULES,
  VIRTUAL_MODULES_MAP,
  VIRTUAL_MODULES_RESOLVE_PREFIX,
  VITE_PWA_PLUGIN_NAMES,
} from '../constants'
import { generateRegisterSW } from '../modules'
import { configureSvelteKitOptions, resolveOptions } from '../options'
import { createAPI } from '../api'
import type { PWAPluginContext } from '../context'
import { swDevOptions } from './dev'

export function MainPlugin(ctx: PWAPluginContext): Plugin {
  return {
    name: VITE_PWA_PLUGIN_NAMES.main,
    enforce: 'pre',
    async configResolved(config) {
      ctx.useImportRegister = false
      ctx.viteConfig = config
      // add support for new SvelteKit Vite Plugin.
      // we need to detect the sveltekit plugin on client build
      if (!ctx.userOptions.disable && !ctx.viteConfig.build.ssr && ctx.lookupSvelteKitPlugin())
        configureSvelteKitOptions(ctx.userOptions)

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
