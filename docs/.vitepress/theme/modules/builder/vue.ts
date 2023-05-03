import type { PWABuilderData, PWABuilderGenerator, PWABuilderResultType } from '../../types'
import { entrypointData, viteConfigData } from '../generatePWACode'
import { generateEntryPoint } from '../entry-point'
import { generatePluginConfiguration } from '../plugin'
import { createPWAPromptGenerators } from '../createPWAPromptGenerator'

const assets = import.meta.globEager('/src/assets/vue-*.txt', { as: 'raw' })
const assetsMap = new Map<string, string>()
for (const name in assets) {
  let assetName = name.slice('/src/assets/vue-'.length)
  assetName = assetName.slice(0, assetName.lastIndexOf('.'))
  assetsMap.set(assetName, assets[name] as any)
}

export default <PWABuilderGenerator>{
  configure() {
    entrypointData.enabled = true
    viteConfigData.enabled = true
  },
  generate(data: PWABuilderData) {
    const generators: [PWABuilderResultType, () => void][] = [
      ['entry-point', () => generateEntryPoint(data, entrypointData)],
      ['vite-config', () => generatePluginConfiguration(data, viteConfigData)],
    ]
    if (data.generateFWComponent)
      createPWAPromptGenerators(data, generators, assetsMap, 'PWAPrompt.vue', 'vue', true)

    return generators
  },
}
