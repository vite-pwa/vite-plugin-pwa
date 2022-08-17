import { resolveConfig } from 'vite'
import type { VitePWAOptions, VitePluginPWAAPI } from '../../types'
import { VitePWA } from '../../index'

export function createBuildEndHook(userOptions: Partial<VitePWAOptions>): (siteConfig: any) => Promise<void> {
  return async (...args: any[]) => {
    // run first integration hook
    await userOptions.integrationHook?.(...args)
    const viteConfig = await resolveConfig({
      plugins: [VitePWA(userOptions)],
    },
    'build',
    'production',
    )
    const pwaPlugin: VitePluginPWAAPI = viteConfig.plugins.find(i => i.name === 'vite-plugin-pwa')?.api
    const pwa = pwaPlugin && !pwaPlugin.disabled
    if (pwa)
      await pwaPlugin.generateSW()
  }
}
