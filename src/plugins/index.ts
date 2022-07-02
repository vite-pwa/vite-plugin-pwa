import type { Plugin } from 'vite'
import { VIRTUAL_MODULES, VIRTUAL_MODULES_MAP, VIRTUAL_MODULES_RESOLVE_PREFIX } from '../constants'
import { generateRegisterSW } from '../modules'
import type { PWAPluginContext, PWAPluginContextResolver } from '../context'
import { resolvePWAPluginContext } from '../context'
import type { VitePWAOptions } from '../types'
import { swDevOptions } from './dev'

export function CreatePlugin(userOptions: Partial<VitePWAOptions>): [PWAPluginContextResolver, Plugin] {
  let context: PWAPluginContext
  const contextResolver: PWAPluginContextResolver = () => {
    return context
  }
  return [
    contextResolver,
    <Plugin> {
      name: 'vite-plugin-pwa:virtual',
      async configResolved(config) {
        context = await resolvePWAPluginContext(config, userOptions)
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
          context.useImportRegister = true
          if (context.viteConfig.command === 'serve' && context.options.devOptions.enabled) {
            return generateRegisterSW(
              { ...context.options, filename: swDevOptions.swUrl },
              'build',
              VIRTUAL_MODULES_MAP[id],
            )
          }
          else {
            return generateRegisterSW(
              context.options,
              !context.options.disable && context.viteConfig.command === 'build' ? 'build' : 'dev',
              VIRTUAL_MODULES_MAP[id],
            )
          }
        }
      },
    },
  ]
}
