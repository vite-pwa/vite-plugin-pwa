import type { Plugin } from 'vite'
import type { PWAPluginContext } from '../context'
import {
  PWA_INFO_VIRTUAL,
  RESOLVED_PWA_INFO_VIRTUAL,
} from '../constants'
import type { VitePluginPWAAPI } from '../types'

export function InfoPlugin(ctx: PWAPluginContext, api: VitePluginPWAAPI) {
  return <Plugin>{
    name: 'vite-plugin-pwa:info',
    enforce: 'post',
    resolveId(id) {
      if (id === PWA_INFO_VIRTUAL)
        return RESOLVED_PWA_INFO_VIRTUAL

      return undefined
    },
    load(id) {
      if (id === RESOLVED_PWA_INFO_VIRTUAL)
        return generatePwaInfo(ctx, api)
    },
  }
}

function generatePwaInfo(ctx: PWAPluginContext, api: VitePluginPWAAPI) {
  const webManifestData = api.webManifestData()
  if (!webManifestData)
    return 'export const pwaInfo = undefined;'

  const { href, useCredentials, toLinkTag } = webManifestData
  const registerSWData = api.registerSWData()

  const entry = {
    pwaInDevEnvironment: api.pwaInDevEnvironment,
    webManifest: {
      href,
      useCredentials,
      linkTag: toLinkTag(),
    },
    registerSW: undefined,
  }

  if (registerSWData) {
    const script = registerSWData.toScriptTag()
    if (script) {
      const { inline, inlinePath, registerPath, type, scope } = registerSWData
      entry.registerSW = {
        inline,
        inlinePath,
        registerPath,
        type,
        scope,
        script,
      } as any
    }
  }

  return `export const pwaInfo = ${JSON.stringify(entry)};`
}
