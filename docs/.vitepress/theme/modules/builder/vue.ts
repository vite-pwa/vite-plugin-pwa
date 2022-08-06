import type { PWABuilderData, PWABuilderGenerator, PWABuilderResultType } from '../../types'
import { entrypointData, fwComponentData, viteConfigData } from '../generatePWACode'
import { generateEntryPoint } from '../entry-point'
import { generatePluginConfiguration } from '../plugin'

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
    if (data.generateFWComponent) {
      const { behavior, warnsUser, periodicSWUpdates } = data
      generators.push(['prompt-component', () => {
        fwComponentData.codeType = 'vue'
        let template: string
        if (behavior === 'autoUpdate') {
          template = periodicSWUpdates ? 'sfc-warn-updates' : 'sfc-warn-updates'
        }
        else {
          template = warnsUser
            ? (periodicSWUpdates ? 'sfc-prompt-warn-updates' : 'sfc-prompt-warn')
            : (periodicSWUpdates ? 'sfc-prompt-updates' : 'sfc-prompt')
        }

        fwComponentData.code = `
${assetsMap.get(template)}

${assetsMap.get('sfc-style')}
`
      }])
    }

    return generators
  },
}
