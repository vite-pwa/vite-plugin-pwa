import type { PWABuilderData, PWABuilderGenerator } from '../../types'
import { entrypointData, tsConfigData, viteConfigData } from '../generatePWACode'

export default <PWABuilderGenerator>{
  configure() {
    entrypointData.enabled = true
    viteConfigData.enabled = true
    tsConfigData.enabled = true
  },
  generate(data: PWABuilderData) {
    return []
  },
}
