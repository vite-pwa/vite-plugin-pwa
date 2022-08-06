import type { PWABuilderData, PWABuilderGenerator, PWABuilderResultType } from '../../types'
import {
  dtsConfigData,
  entrypointData,
  fwCSSComponentData,
  tsConfigData,
  viteConfigData,
} from '../generatePWACode'
import { generateEntryPoint } from '../entry-point'
import { generatePluginConfiguration } from '../plugin'
import { createJsxGenerators } from '../createJsxGenerators'
import { createTSGenerators } from '../createTSGenerators'

const assets = import.meta.globEager('/src/assets/react-*.txt', { as: 'raw' })
const assetsMap = new Map<string, string>()
for (const name in assets) {
  let assetName = name.slice('/src/assets/react-'.length)
  assetName = assetName.slice(0, assetName.lastIndexOf('.'))
  assetsMap.set(assetName, assets[name] as any)
}

export default <PWABuilderGenerator>{
  configure(data) {
    entrypointData.enabled = true
    viteConfigData.enabled = true
    tsConfigData.enabled = data.typescript && data.generateFWComponent
    dtsConfigData.enabled = data.generateFWComponent
    fwCSSComponentData.enabled = data.generateFWComponent
  },
  generate(data: PWABuilderData) {
    const generators: [PWABuilderResultType, () => void][] = [
      ['entry-point', () => generateEntryPoint(data, entrypointData)],
      ['vite-config', () => generatePluginConfiguration(data, viteConfigData)],
    ]
    createTSGenerators({ tsConfig: tsConfigData.enabled, dts: dtsConfigData.enabled }, generators)
    createJsxGenerators(data, generators, assetsMap)

    return generators
  },
}
