import type { PWABuilderData } from '../types'
import { fwComponentData } from './generatePWACode'

export function createPWAPromptGenerators(data: PWABuilderData, generators: any[], assetsMap: Map<string, string>) {
  if (data.generateFWComponent) {
    const { behavior, warnsUser, periodicSWUpdates, typescript } = data
    generators.push(['prompt-component', () => {
      fwComponentData.codeType = typescript ? 'tsx' : 'jsx'
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
/* PWAPrompt.${typescript ? 't' : 'j'}sx */        
${assetsMap.get(template)}
`
    }])
  }
}
