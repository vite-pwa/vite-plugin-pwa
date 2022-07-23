import type { PWABuilderData, PWABuilderGenerator } from '../../types'
import { DEFAULT_TIMEOUT, entrypointData, viteConfigData } from '../generatePWACode'
import { generateEntryPoint } from '../entry-point'
import { generatePluginConfiguration } from '../plugin'

export default <PWABuilderGenerator>{
  configure() {
    entrypointData.enabled = true
    viteConfigData.enabled = true
  },
  async generate(data: PWABuilderData) {
    await generateEntryPoint(data, entrypointData)
    await new Promise(resolve => setTimeout(resolve, DEFAULT_TIMEOUT))
    entrypointData.loading = false
    await generatePluginConfiguration(data, viteConfigData)
    await new Promise(resolve => setTimeout(resolve, DEFAULT_TIMEOUT))
    viteConfigData.loading = false
  },
}
