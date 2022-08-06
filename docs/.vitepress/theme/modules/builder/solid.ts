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

const assets = import.meta.globEager('/src/assets/solid-*.txt', { as: 'raw' })
const assetsMap = new Map<string, string>()
for (const name in assets) {
  let assetName = name.slice('/src/assets/solid-'.length)
  assetName = assetName.slice(0, assetName.lastIndexOf('.'))
  assetsMap.set(assetName, assets[name] as any)
}

export default <PWABuilderGenerator>{
  configure(data) {
    entrypointData.enabled = true
    viteConfigData.enabled = true
    tsConfigData.enabled = data.typescript
    fwCSSComponentData.enabled = data.generateFWComponent
  },
  generate(data: PWABuilderData) {
    const generators: [PWABuilderResultType, () => void][] = [
      ['entry-point', () => generateEntryPoint(data, entrypointData)],
      ['vite-config', () => generatePluginConfiguration(data, viteConfigData)],
    ]
    if (data.typescript) {
      generators.push(['ts-config', () => {
        tsConfigData.code = `
// tsconfig.json
"compilerOptions": {
  "types": [
    "vite-plugin-pwa/client"
  ]  
}
`
      }])
    }
    else {
      generators.push(['dts-config', () => {
        dtsConfigData.code = `
// src/vite-env.d.ts
/// <reference types="vite-plugin-pwa/client" />    
        `
      }])
    }

    createJsxGenerators(data, generators, assetsMap, 'PWAPrompt.module.css')

    return generators
  },
}
