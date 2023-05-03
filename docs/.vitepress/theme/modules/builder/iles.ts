import type { PWABuilderData, PWABuilderGenerator, PWABuilderResultType } from '../../types'
import { ilesConfigData } from '../generatePWACode'

import { generatePluginConfiguration } from '../plugin'

export default <PWABuilderGenerator>{
  configure({ framework }) {
    ilesConfigData.enabled = framework === 'iles'
  },
  generate(data: PWABuilderData) {
    const generators: [PWABuilderResultType, () => void][] = []
    if (ilesConfigData.enabled)
      generators.push(['iles-config', () => generatePluginConfiguration(data, ilesConfigData)])

    return generators
  },
}
