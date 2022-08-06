import type { PWABuilderData, PWABuilderResult } from '../types'
import type { VitePWAOptions } from '../../../../dist'

export function generatePluginConfiguration(
  {
    title,
    shortName,
    description,
    themeColor: theme_color,
    scope: useScope,
    registerType: injectRegister,
    strategy,
    behavior,
    startUrl: start_url,
    addManifestMaskedIcon,
    typescript,
    cleanupOldAssets,
  }: PWABuilderData,
  pwaBuilderResult: PWABuilderResult,
) {
  const extension = typescript ? 'ts' : 'js'
  const scope = useScope === '/' ? undefined : useScope
  const base = useScope === '/' ? undefined : useScope
  const strategies = strategy === 'injectManifest' ? strategy : undefined
  const registerType = behavior === 'autoUpdate' ? behavior : undefined
  const short_name = shortName ?? title
  const plugin: Partial<VitePWAOptions> = {
    scope,
    base,
    injectRegister,
    strategies,
    registerType,
  }
  if (strategy === 'injectManifest' && typescript) {
    plugin.srcDir = 'src'
    plugin.filename = 'sw.ts'
  }
  const manifest = {
    scope,
    name: title,
    short_name,
    description,
    theme_color,
    start_url,
    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }

  if (addManifestMaskedIcon) {
    (manifest as any).icons!.push({
      src: 'pwa-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable',
    })
  }
  plugin.manifest = manifest
  if (strategy === 'generateSW' && cleanupOldAssets)
    plugin.workbox = { cleanupOutdatedCaches: true }

  pwaBuilderResult.codeType = extension
  pwaBuilderResult.code = `
// vite.config.${extension}  
import { VitePWA } from 'vite-plugin-pwa'

VitePWA(${JSON.stringify(plugin, null, 2).replace(
    /"(\w+)":/g, '$1:',
  ).replace(
      /"/g, '\'',
  )})  
`
}
