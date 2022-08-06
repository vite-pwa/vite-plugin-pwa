import type { PWABuilderData, PWABuilderGenerator } from '../../types'
import { entrypointData, viteConfigData } from '../generatePWACode'

export default <PWABuilderGenerator>{
  configure() {
    entrypointData.enabled = true
    viteConfigData.enabled = true
  },
  generate(data: PWABuilderData) {
    return []
  },
}
