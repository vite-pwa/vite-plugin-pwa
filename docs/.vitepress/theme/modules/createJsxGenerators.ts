import type { PWABuilderData } from '../types'
import { fwCSSComponentData } from './generatePWACode'
import { createPWAPromptGenerators } from './createPWAPromptGenerator'

export function createJsxGenerators(data: PWABuilderData, generators: any[], assetsMap: Map<string, string>, cssName = 'PWAPrompt.css') {
  if (data.generateFWComponent) {
    createPWAPromptGenerators(data, generators, assetsMap)
    generators.push(['prompt-css', () => {
      fwCSSComponentData.code = `
/* ${cssName} */        
${assetsMap.get('sfc-style')}
`
    }])
  }
}
