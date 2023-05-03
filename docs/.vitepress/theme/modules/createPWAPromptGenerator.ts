import type { CodeType, PWABuilderData } from '../types'

import { fwComponentData } from './generatePWACode'

export function createPWAPromptGenerators(
  data: PWABuilderData,
  generators: any[],
  assetsMap: Map<string, string>,
  name?: string,
  codeType?: CodeType,
  addCss = false,
) {
  if (data.generateFWComponent) {
    const { behavior, warnsUser, periodicSWUpdates, typescript } = data
    generators.push(['prompt-component', () => {
      fwComponentData.codeType = codeType ?? (typescript ? 'tsx' : 'jsx')
      let template: string
      if (behavior === 'autoUpdate') {
        template = periodicSWUpdates ? 'sfc-warn-updates' : 'sfc-warn'
      }
      else {
        template = warnsUser
          ? (periodicSWUpdates ? 'sfc-prompt-warn-updates' : 'sfc-prompt-warn')
          : (periodicSWUpdates ? 'sfc-prompt-updates' : 'sfc-prompt')
      }

      const useName = name ?? `PWAPrompt.${typescript ? 't' : 'j'}sx`

      if (addCss) {
        fwComponentData.code = `
/* ${useName} */        
${assetsMap.get(template)}
${assetsMap.get('sfc-style')}
`
      }
      else {
        fwComponentData.code = `
/* ${useName} */        
${assetsMap.get(template)}
`
      }

      if (data.typescript) {
        switch (data.framework) {
          case 'vue':
            fwComponentData.code = fwComponentData.code!.replace('<script setup>', '<script setup lang="ts">')
            break
          case 'svelte':
          case 'sveltekit':
            fwComponentData.code = fwComponentData.code!.replace('<script>', '<script lang="ts">')
            break
          case 'iles':
            fwComponentData.code = fwComponentData.code!.replace('<script client:load>', '<script client:load lang="ts">')
            break
        }
      }
    }])
  }
}
