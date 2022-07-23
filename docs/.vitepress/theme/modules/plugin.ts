import type { PWABuilderData, PWABuilderResult } from '../types'

export function generatePluginConfiguration(
  {
    title,
    shortName,
    description,
    themeColor,
    scope,
    registerType,
    strategy,
    behavior,
    startUrl,
    addManifestMaskedIcon,
    typescript,
  }: PWABuilderData,
  pwaBuilderResult: PWABuilderResult,
) {
  const extension = typescript ? 'ts' : 'js'
  pwaBuilderResult.codeType = extension
  pwaBuilderResult.code = `
// vite.config.${extension}  
import { VitePWA } from 'vite-plugin-pwa'

VitePWA({
    scope: '${scope}',
    base: '${scope}',
    registerType: '${behavior}',
    strategies: '${strategy}',
    injectRegister: '${registerType}',
    manifest: {
        scope: '${scope}',
        base: '${scope}',
        name: '${title}',${startUrl ? `\n\t\tstart_url: '${scope}${startUrl}',` : ''}
        short_name: '${shortName ?? title}',
        description: '${description}',
        theme_color: '${themeColor}',
        icons: [
            {
                src: 'pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png'
            }${addManifestMaskedIcon
              ? `,
            {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable'
            }`
              : ''}
        ]
    }
})  
`
}
