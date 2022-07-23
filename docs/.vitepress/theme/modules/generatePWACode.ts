import { nextTick, reactive } from 'vue'
import type { UnwrapNestedRefs } from 'vue'
import type { FrameworkType, PWABuilderData, PWABuilderGenerator, PWABuilderGeneratorModule, PWABuilderResult, PWABuilderResultType } from '../types'

const builders = import.meta.glob<PWABuilderGeneratorModule>('./builder/*.ts')
const buildesMap = new Map<string, () => Promise<PWABuilderGeneratorModule>>()
for (const name in builders) {
  let builderName = name.slice('./builder/'.length)
  builderName = builderName.slice(0, builderName.lastIndexOf('.'))
  buildesMap.set(builderName, builders[name])
}

export const PWABuilderResultData: Record<PWABuilderResultType, UnwrapNestedRefs<PWABuilderResult>> = {
  'entry-point': reactive<PWABuilderResult>({
    enabled: true,
    loading: true,
    code: undefined,
    codeType: 'html',
  }),
  'vite-config': reactive<PWABuilderResult>({
    enabled: true,
    loading: true,
    code: undefined,
    codeType: 'js',
  }),
}

export const entrypointData = PWABuilderResultData['entry-point']
export const viteConfigData = PWABuilderResultData['vite-config']

export const DEFAULT_TIMEOUT = 1500
// export const DEFAULT_TIMEOUT = 600

export function resetPWACode() {
  Object.values(PWABuilderResultData).forEach((r) => {
    r.code = undefined
    r.loading = true
    r.enabled = false
  })
}

async function lookupBuilder(framework: FrameworkType) {
  const builder = await buildesMap.get(framework)!()
  return 'default' in builder ? builder.default : builder
}

export async function prepareBuilder(data: PWABuilderData) {
  const builder: PWABuilderGenerator = await lookupBuilder(data.framework)
  builder.configure()
  return builder
}

export async function generatePWACode(builder: PWABuilderGenerator, data: PWABuilderData) {
  await nextTick()
  await builder.generate(data)
  // const {
  //   generateEntryPoint,
  //   generatePluginConfiguration,
  // } = await import('./index')
  // await generateEntryPoint(data, entrypointData)
  // await new Promise(resolve => setTimeout(resolve, DEFAULT_TIMEOUT))
  // entrypointData.loading = false
  // await generatePluginConfiguration(data, pluginData)
  // await new Promise(resolve => setTimeout(resolve, DEFAULT_TIMEOUT))
  // pluginData.loading = false
}
