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
    async configResolved(config) {
      ctx.useImportRegister = false
      ctx.viteConfig = config
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
