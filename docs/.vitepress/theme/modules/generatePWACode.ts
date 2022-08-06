import { nextTick, reactive } from 'vue'
import type { UnwrapNestedRefs } from 'vue'
import type { FrameworkType, PWABuilderData, PWABuilderGenerator, PWABuilderGeneratorModule, PWABuilderResult, PWABuilderResultType } from '../types'
import { generatePromptSW } from './prompt-sw'
import { generateClaimsSW } from './claims-sw'

// const builders = import.meta.globEager<PWABuilderGeneratorModule>('./builder/*.ts', { eager: true } )
const builders = import.meta.globEager<PWABuilderGeneratorModule>('./builder/*.ts')
const buildesMap = new Map<string, PWABuilderGeneratorModule>()
for (const name in builders) {
  let builderName = name.slice('./builder/'.length)
  builderName = builderName.slice(0, builderName.lastIndexOf('.'))
  buildesMap.set(builderName, builders[name])
}

// should be in the order that will appear in the PBResult component: the PBResult will use enabled entries
export const PWABuilderResultData: Record<PWABuilderResultType, UnwrapNestedRefs<PWABuilderResult>> = {
  'vite-config': reactive<PWABuilderResult>({
    title: 'Vite Plugin PWA Configuration',
    enabled: false,
    loading: true,
    code: undefined,
    codeType: 'js',
  }),
  'ts-config': reactive<PWABuilderResult>({
    title: 'TypeScript Configuration',
    enabled: false,
    loading: true,
    code: undefined,
    codeType: 'json',
  }),
  'dts-config': reactive<PWABuilderResult>({
    title: 'TypeScript DTs',
    enabled: false,
    loading: true,
    code: undefined,
    codeType: 'ts',
  }),
  'entry-point': reactive<PWABuilderResult>({
    title: 'Entry Point (index.html)',
    enabled: false,
    loading: true,
    code: undefined,
    codeType: 'html',
  }),
  'prompt-component': reactive<PWABuilderResult>({
    title: 'PWA Component',
    enabled: false,
    loading: true,
    code: undefined,
    codeType: 'js',
  }),
  'prompt-css': reactive<PWABuilderResult>({
    title: 'PWA Component CSS',
    enabled: false,
    loading: true,
    code: undefined,
    codeType: 'css',
  }),
  'prompt-sw': reactive<PWABuilderResult>({
    title: 'Custom Prompt Service Worker',
    enabled: false,
    loading: true,
    code: undefined,
    codeType: 'js',
  }),
  'auto-sw': reactive<PWABuilderResult>({
    title: 'Custom AutoUpdate Service Worker',
    enabled: false,
    loading: true,
    code: undefined,
    codeType: 'js',
  }),
}

export const entrypointData = PWABuilderResultData['entry-point']
export const tsConfigData = PWABuilderResultData['ts-config']
export const dtsConfigData = PWABuilderResultData['dts-config']
export const viteConfigData = PWABuilderResultData['vite-config']
export const fwComponentData = PWABuilderResultData['prompt-component']
export const fwCSSComponentData = PWABuilderResultData['prompt-css']
export const promptSWData = PWABuilderResultData['prompt-sw']
export const autoSWData = PWABuilderResultData['auto-sw']

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
  const builder = buildesMap.get(framework)!
  return 'default' in builder ? builder.default : builder
}

export async function prepareBuilder(data: PWABuilderData) {
  const builder: PWABuilderGenerator = await lookupBuilder(data.framework)
  builder.configure(data)
  configureAddons(data)
  return builder
}

export function configureAddons(data: PWABuilderData) {
  PWABuilderResultData['prompt-component'].enabled = data.generateFWComponent
  if (data.strategy === 'injectManifest') {
    if (data.behavior === 'prompt')
      promptSWData.enabled = true
    else
      autoSWData.enabled = true
  }
}

export async function generatePWACode(builder: PWABuilderGenerator, data: PWABuilderData) {
  await nextTick()
  const fns = builder.generate(data)
  if (data.strategy === 'injectManifest') {
    if (data.behavior === 'prompt')
      fns.push(['prompt-sw', () => generatePromptSW(data, promptSWData)])
    else
      fns.push(['auto-sw', () => generateClaimsSW(data, autoSWData)])
  }
  await Promise.all(fns.map(async ([key, fn]) => {
    fn()
    // await new Promise(resolve => setTimeout(resolve, DEFAULT_TIMEOUT))
    PWABuilderResultData[key].loading = false
  }))
}
