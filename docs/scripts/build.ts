import { resolveConfig } from 'vite'
import { VitePluginPWAAPI } from '../../dist'
import { optimizePages } from './assets'

const rebuildPwa = async() => {
  const config = await resolveConfig({}, 'build', 'production')
  // when `vite-plugin-pwa` is presented, use it to regenerate SW after rendering
  const pwaPlugin: VitePluginPWAAPI = config.plugins.find(i => i.name === 'vite-plugin-pwa')?.api
  if (pwaPlugin?.generateSW) {
    console.log('Regenerate PWA...')
    await optimizePages()
    await pwaPlugin.generateSW()
    console.log('Regenerated PWA complete')
  }
}

rebuildPwa()
