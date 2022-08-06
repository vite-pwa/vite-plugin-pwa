import type { PWABuilderGenerator, PWABuilderResultType } from '../../types'
import {
  dtsConfigData,
  entrypointData,
  tsConfigData,
  viteConfigData,
} from '../generatePWACode'

import { generateEntryPoint } from '../entry-point'
import { generatePluginConfiguration } from '../plugin'
import { createTSGenerators } from '../createTSGenerators'
import { createPWAPromptGenerators } from '../createPWAPromptGenerator'

const assets = import.meta.globEager('/src/assets/svelte-*.txt', { as: 'raw' })
const assetsMap = new Map<string, string>()
for (const name in assets) {
  let assetName = name.slice('/src/assets/svelte-'.length)
  assetName = assetName.slice(0, assetName.lastIndexOf('.'))
  assetsMap.set(assetName, assets[name] as any)
}

export default <PWABuilderGenerator>{
  configure(data) {
    entrypointData.enabled = true
    viteConfigData.enabled = true
    tsConfigData.enabled = data.typescript && data.generateFWComponent
    dtsConfigData.enabled = !data.typescript && data.generateFWComponent
  },
  generate(data) {
    const generators: [PWABuilderResultType, () => void][] = [
      ['entry-point', () => generateEntryPoint(data, entrypointData)],
      ['vite-config', () => generatePluginConfiguration(data, viteConfigData)],
    ]
    createTSGenerators(
      {
        tsConfig: tsConfigData.enabled,
        dts: dtsConfigData.enabled,
      },
      generators,
    )
    if (data.generateFWComponent)
      createPWAPromptGenerators(data, generators, assetsMap, 'PWAPrompt.svelte', 'svelte', true)

    return generators
  },
}
