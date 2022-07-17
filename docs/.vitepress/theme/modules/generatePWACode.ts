import { nextTick, reactive } from 'vue'
import type { PWABuilderData, PWABuilderResult } from '../types'

export const entrypointData = reactive<PWABuilderResult>({
  enabled: true,
  loading: true,
  code: undefined,
})
export const pluginData = reactive<PWABuilderResult>({
  enabled: true,
  loading: true,
  code: undefined,
})

export const DEFAULT_TIMEOUT = 1500
// export const DEFAULT_TIMEOUT = 600

export function resetPWACode() {
  entrypointData.code = undefined
  pluginData.code = undefined
  entrypointData.loading = true
  pluginData.loading = true
}

export async function generatePWACode(data: PWABuilderData) {
  await nextTick()
  const {
    generateEntryPoint,
    generatePluginConfiguration,
  } = await import('./index')
  await generateEntryPoint(data, entrypointData)
  await new Promise(resolve => setTimeout(resolve, DEFAULT_TIMEOUT))
  entrypointData.loading = false
  await generatePluginConfiguration(data, pluginData)
  await new Promise(resolve => setTimeout(resolve, DEFAULT_TIMEOUT))
  pluginData.loading = false
}
