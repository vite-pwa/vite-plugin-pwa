import { nextTick, reactive } from 'vue'
import type { UnwrapNestedRefs } from 'vue'
import type {
  FrameworkType,
  PWABuilderData,
  PWABuilderGenerator,
  PWABuilderGeneratorModule,
  PWABuilderResult,
  PWABuilderResultType,
} from '../types'

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
  'package-json': reactive<PWABuilderResult>({
    title: 'package.json',
    enabled: false,
    loading: true,
    code: undefined,
    codeType: 'json',
  }),
  'vite-config': reactive<PWABuilderResult>({
    title: 'Vite Plugin PWA Configuration',
    enabled: false,
    loading: true,
    code: undefined,
    codeType: 'js',
  }),
  'iles-config': reactive<PWABuilderResult>({
    title: 'îles Configuration',
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

export const packageData = PWABuilderResultData['package-json']
export const entrypointData = PWABuilderResultData['entry-point']
export const tsConfigData = PWABuilderResultData['ts-config']
export const dtsConfigData = PWABuilderResultData['dts-config']
export const viteConfigData = PWABuilderResultData['vite-config']
export const ilesConfigData = PWABuilderResultData['iles-config']
export const fwComponentData = PWABuilderResultData['prompt-component']
export const fwCSSComponentData = PWABuilderResultData['prompt-css']
export const promptSWData = PWABuilderResultData['prompt-sw']
export const autoSWData = PWABuilderResultData['auto-sw']

// export const DEFAULT_TIMEOUT = 1500
export const DEFAULT_TIMEOUT = 600

export function resetPWACode() {
  Object.values(PWABuilderResultData).forEach((r) => {
    r.code = undefined
    r.loading = true
    r.enabled = false
  })
}

type BuilderType = FrameworkType | 'sw' | 'packageJson'

function lookupBuilder(builderType: BuilderType) {
  const builder = buildesMap.get(builderType)!
  return 'default' in builder ? builder.default : builder
}

export function prepareBuilder(data: PWABuilderData) {
  configureAddons(data)
  const builder: PWABuilderGenerator = lookupBuilder(data.framework)
  builder.configure(data)
  return builder
}

export function configureAddons(data: PWABuilderData) {
  PWABuilderResultData['prompt-component'].enabled = data.generateFWComponent
  lookupBuilder('sw').configure(data)
  lookupBuilder('packageJson').configure(data)
}

export async function generatePWACode(builder: PWABuilderGenerator, data: PWABuilderData) {
  await nextTick()
  const generators = builder.generate(data)
  generators.push(...lookupBuilder('sw').generate(data))
  generators.push(...lookupBuilder('packageJson').generate(data))
  await Promise.all(generators.map(async ([key, generate]) => {
    generate()
    PWABuilderResultData[key].loading = false
  }))
}
